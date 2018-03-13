/**
 * @author Artem Strilets
 */
const chalk = require('chalk');

const log = console.log;

const name = 'Sindre';

console.log(chalk.blue('Hello'), name);

const warning = chalk.bold.red;
 
log(warning('Warning!'));

const fine = chalk.bold.green;

log(fine('Im Fine!'));

log(chalk.bold.black('End'))
