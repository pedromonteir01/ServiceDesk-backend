const pool = require('../database/database.config');

const special = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '/', '?', '|'];
const verifyElements = (array, type) => {
    return array.every(element => typeof element === type);
}

const getAllUsers = async (req, res) => {
    try {
        //requisição para o banco
        const users = await pool.query('SELECT * FROM users;');
        //resposta em JSON
        if(users.rowCount == 0) {
            return res.status(200).send({
                message: 'none_users'
            })
        } else {
            return res.status(200).send({
                results: users.rowCount,
                users: users.rows
            });
        }
    } catch (e) {
        //retorno do erro em JSON
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in get all users'
        });
    }
}

const getUsersByName = async (req, res) => {
    //name por params
    const { name } = req.params;
    try {
        //requisição para o banco
        const users = await pool.query('SELECT * FROM users WHERE name LIKE $1;',
            [`%${name.toLowerCase()}%`]
        );
        //resposta em JSON
        if (users) {
            return res.status(200).send({
                results: users.rowCount,
                users: users.rows
            });
        } else {
            return res.status(404).send({
                error: 404,
                message: 'Users not found with this name: ' + name
            });
        }

    } catch (e) {
        //retorno do erro em JSON
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in get user: ' + email
        });
    }
}

const getUserByEmail = async (req, res) => {
    //email por params
    const { email } = req.params;
    try {
        //requisição para o banco
        const user = await pool.query('SELECT * FROM users WHERE email=$1;',
            [email]
        );
        //resposta em JSON
        if (user) {
            return res.status(200).send({
                user: user.rows[0]
            });
        } else {
            return res.status(404).send({
                error: 404,
                message: 'User not found: ' + email
            });
        }

    } catch (e) {
        //retorno do erro em JSON
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in get user: ' + email
        });
    }
}

const getUserByRole = async (req, res) => {
    //função por params
    const { role } = req.params;
    let occupation;

    if(role == 'student') {
        occupation = true;
    } else {
        occupation = false;
    }

    try {
        //requisição para o banco
        const users = await pool.query('SELECT * FROM users WHERE isStudent=$1;',
            [occupation]
        );
        //resposta em JSON
        if (users.rowCount !== 0) {
            return res.status(200).send({
                users: users.rows
            });
        } else {
            return res.status(404).send({
                error: 404,
                message: 'Users not found'
            });
        }

    } catch (e) {
        //retorno do erro em JSON
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in get user: ' + email
        });
    }
}

const createUser = async (req, res) => {
    let errors = [];

    //body para criar elementos
    const { name, email, password, isAdmin, isStudent } = req.body;

    switch (name) {
        case typeof name !== 'string':
            errors.push('invalid_name');
            break;
        case name.length < 3:
            errors.push('short_name');
            break;
        default:
            break;
    }

    switch (email) {
        case typeof email !== 'string':
            errors.push('invalid_email');
            break;
        case email.length < 10:
            errors.push('short_email');
            break;
        case !email.includes('@') || !email.includes('sp.senai.br') || !email.includes('aluno.senai.br'):
            errors.push('invalid_domain');
            break;
        default:
            break;
    }

    switch (password) {
        case password.length < 8:
            errors.push('short_password');
            break;
        case !verifyElements(password.split(''), 'string'):
            errors.push('must_contain_numbers');
            break;
        case !verifyElements(password.split(''), 'number'):
            errors.push('must_contain_numbers');
            break;
        case password.split('').includes(special):
            errors.push('must_contain_special_characters');
            break;
        default:
            break;
    }

    if (typeof isAdmin !== 'boolean') {
        errors.push('invalid_propertie');
    }

    if (typeof isStudent !== 'boolean') {
        errors.push('invalid_role');
    }

    if (errors.length !== 0) {
        return res.status(400).send({
            errors: errors
        });
    } else {

        try {
            //requisição para o banco
            await pool.query('INSERT INTO users(name, email, password, isAdmin, isStudent) VALUES($1, $2, $3, $4, $5);',
                [name, email, password, isAdmin, isStudent]
            );
            //resposta em JSON
            return res.status(201).send({
                message: 'registered with success'
            });
        } catch (e) {
            //retorno do erro em JSON
            return res.status(500).send({
                error: 'Error: ' + e,
                message: 'Error in post user'
            });
        }
    }
}

const updateUser = async (req, res) => {
    let errors = [];

    //email por params
    const { emailAux } = req.params;

    //body para criar elementos
    const { name, email, password, isAdmin, isStudent } = req.body;

    switch (name) {
        case typeof name !== 'string':
            errors.push('invalid_name');
            break;
        case name.length < 3:
            errors.push('short_name');
            break;
        default:
            break;
    }

    switch (email) {
        case typeof email !== 'string':
            errors.push('invalid_email');
            break;
        case email.length < 10:
            errors.push('short_email');
            break;
        case !email.includes('@') || !email.includes('sp.senai.br') || !email.includes('aluno.senai.br'):
            errors.push('invalid_domain');
            break;
        default:
            break;
    }

    switch (password) {
        case password.length < 8:
            errors.push('short_password');
            break;
        case !verifyElements(password.split(''), 'string'):
            errors.push('must_contain_numbers');
            break;
        case !verifyElements(password.split(''), 'number'):
            errors.push('must_contain_numbers');
            break;
        case password.split('').includes(special):
            errors.push('must_contain_special_characters');
            break;
        default:
            break;
    }

    if (typeof isAdmin !== 'boolean') {
        errors.push('invalid_propertie');
    }

    if (typeof isStudent !== 'boolean') {
        errors.push('invalid_role');
    }

    if (errors.length !== 0) {
        return res.status(400).send({
            errors: errors
        });
    } else {

        try {
            //requisição para o banco
            await pool.query('UPDATE users SET name=$1, email=$2, isAdmin=$3, isStudents=$4 WHERE email=$5;',
                [name, email, password, isAdmin, isStudent, emailAux]
            );
            //resposta em JSON
            return res.status(200).send({
                message: 'updated with success'
            });
        } catch (e) {
            //retorno do erro em JSON
            return res.status(500).send({
                error: 'Error: ' + e,
                message: 'Error in post user'
            });
        }
    }
}

const deleteUser = async (req, res) => {
    //email por params
    const { email } = req.params;

    try {
        //coleta usuário
        const user = await pool.query('SELECT * FROM users WHERE email=$1;',
            [email]
        );

        //verifica se existe
        if (!user) {
            return res.status(404).send({
                error: 'user not found'
            });
        } else {
            //se existir, deleta
            await pool.query('DELETE FROM users WHERE email=$1;',
                [email]
            );

            return res.status(200).send({
                message: 'user deleted'
            });
        }
    } catch (e) {
        //retorno do erro em JSON
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in delete user'
        });
    }
}

module.exports = { getAllUsers, getUsersByName, getUserByEmail, getUserByRole, createUser, updateUser, deleteUser };