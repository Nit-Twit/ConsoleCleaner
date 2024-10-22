# ConsoleCleaner

ConsoleCleaner is an npm package designed to help developers clean up and manage console logs in their JavaScript applications.

## Usage

Simply run the cli

```bash
$ npx console-cleaner
```

### Config

There are currently two config options: `verbose` and `ignore`. 
To run the cli with config create a file called `.cleanerconfig.json`.
<br>Here's an example of what your config might look like:

```json
{
    "verbose": true,
    "ignore": ["index.js", "*.ts"]
}
```
This would exclude the file `index.js` and every file ending in `.ts`

**By default the tool automatically excludes the node_modules folder and it's contents**

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.