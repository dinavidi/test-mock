require('dotenv').config()

const fs = require('fs')
const path = require('path')

const { FILE_URL } = process.env

function readAll(modelname) {
    try {
        if (fs.existsSync(FILE_URL)) {
            const filePath = path.join(FILE_URL, `${modelname}.json`)
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath)
                const list = JSON.parse(data)
                return list
            }
        }
        return []
    }

    catch (error) {
        throw error
    }
}

function searchFile({ filename, folderPath }) {
    let result = []
    const files = fs.readdirSync(folderPath)
    for (let file of files) {
        const fullPath = path.join(folderPath, file)
        const stat = fs.statSync(fullPath)
        console.log({fullPath});
        if (stat.isDirectory() && file !== 'node_modules') {
            result = [...result, searchFile({ filename: file, folderPath: fullPath })]
        }
        else {
            if (file === filename) {
                result.push(fullPath)
            }
        }
    }
    return result
}

console.log(searchFile({filename:'mongo-operations.js', folderPath:'G:\\Programming'}))

module.exports = { readAll }