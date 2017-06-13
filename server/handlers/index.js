const fs = require('fs')
const path = require('path')

const defaults = {
    templatePath: path.resolve('..', __dirname)
}

const IndexHandler = (opts = defaults) => {
    console.log('IndexHandler options', opts);

    return (req, res) => {
        fs.readFile(path.join(opts.templatePath, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500)
                return res.end('Error loading index.html')
            }

            res.writeHead(200)
            res.end(data)
        })
    }
}

module.exports = IndexHandler
