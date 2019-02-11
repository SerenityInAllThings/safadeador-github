#!/usr/bin/env node
import * as request from 'request';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPath from 'fs-Path';
import * as yargs from 'yargs';

const argv = yargs.argv;
const proxy = yargv.proxy;

async function main() {
    const args = process.argv;
    const urlRepo = extrairUrlRepo(args);
    if (!urlRepo)
        return -1;

    let pastaBase = await recuperarPastaBaseRepo(urlRepo);
    var pastaDestino = await criarPastaDestino(__dirname, urlRepo);
    await baixarArquivos(pastaBase, pastaDestino);
}

function criarPastaDestino(pathBase, urlRepo) {
    return new Promise((resolve, reject) => {
        const nomeRepo = urlRepo.split('/')[4];
        const pastaDestino = path.join(pathBase, nomeRepo);
        fs.mkdir(pastaDestino, (err) => {
            if (err && err.code != "EEXIST")
            {
                console.log(JSON.stringify(err, null, 2))
                reject(err);
            }
            else
                resolve(pastaDestino);
        });
    });
}

function extrairUrlRepo(args) {
    if (!args[2]) {
        console.log(`Não foi informado um repositório a ser safadeado`);
        return null;
    }

    return args[2].trim();
}

function requisitarGet(path, absolutePath) {
    return new Promise((resolve, reject) => {
        const githubBaseUrl = 'https://api.github.com';
        const opcoesRequisicao = {
            url: absolutePath ? path : githubBaseUrl + path,
            headers: {
                'User-Agent': 'safadeador-github',
            },
        };

        if (proxy)
            request.defaults({ proxy });

        request.get(opcoesRequisicao, (error, response, body) => {
            if (error) {
                console.log(`Erro ao requisitar get em ${githubBaseUrl + path}`);
                console.log(error);
            }
            else {
                resolve(body);
            }
        });
    });
}

async function recuperarPastaBaseRepo(urlRepo) {
    const nomeAutor = urlRepo.split('/')[3];
    const nomeRepo = urlRepo.split('/')[4];
    const pathInicialRelativo = `/repos/${nomeAutor}/${nomeRepo}/contents`;

    const indexRepo = JSON.parse(await requisitarGet(pathInicialRelativo));
    return indexRepo;
}

async function baixarArquivos(repoFolder, baseFolder) {
    const fileType = "file";
    const folderType = "dir";
    var promiseList = [];

    repoFolder.forEach(async (item) => {
        if (item.type == fileType) {
            console.log(`Baixando arquivo ${item.path}`);
            promiseList.push(baixarArquivo(item, baseFolder));
        }
        else if (item.type == folderType) {
            console.log(`Baixando pasta ${item.path}`);
            var pasta = JSON.parse(await requisitarGet(item.url, true));
            promiseList.push(baixarArquivos(pasta, baseFolder));
        }
        else {
            console.log(`Encontrado item estranho: ${item}`);
        }
    });

    await Promise.all(promiseList);
}

function baixarArquivo(item, baseFolder) {
    const encoding = 'utf8';
    return new Promise((resolve, reject) => {
        requisitarGet(item.download_url, true)
        .then(conteudo => {
            const filePath = path.join(baseFolder, item.path);
            console.log(filePath);
            fsPath.writeFile(filePath, conteudo, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });
} 

main();