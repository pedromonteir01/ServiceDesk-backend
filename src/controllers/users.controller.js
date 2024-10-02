const pool = require('../database/database.config');
const { verifyElements, verifyEmail } = require('../models/verifysFunctions/verifyElements');
const special = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '/', '?', '|'];

const getAllUsers = async (req, res) => {
    try {
        //requisição para o banco
        const users = await pool.query('SELECT * FROM users;');
        //resposta em JSON
        if (users.rowCount == 0) {
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
            return res.status(200).send(user.rows[0]);
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

    if (role == 'student') {
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

    if (typeof name !== 'string') {
        errors.push('nome_inválido');
    } else if (name.length < 3) {
        errors.push('nome_curto_demais');
    }

    if (typeof email !== 'string') {
        errors.push('email_inválido');
    } else if (email.length < 10) {
        errors.push('email_inválido');
    } else if (!verifyEmail(email, '@sp.senai.br') || !verifyEmail(email, '@aluno.senai.br')) {
        errors.push('domínio_inválido');
    }


    if (password.length < 8) {
        errors.push('senha_deve_ter_8_no_mínimo_caracteres');
    } else if (password.split('').includes(special)) {
        errors.push('senha_deve_ter_caracteres_especiais');
    }

    let statusAdmin;
    switch (isAdmin) {
        case 'admin':
            statusAdmin = true;
            break;
        case 'user':
            statusAdmin = false;
            break;
        default:
            errors.push('status_inválido');
            break;
    }

    let role;
    switch (isStudent) {
        case 'student':
            role = true;
            break;
        case 'educator':
            role = false;
            break;
        default:
            errors.push('cargo_inválido');
            break;
    }

    if (errors.length !== 0) {
        return res.status(400).send({errors});
    } else {

        try {
            //requisição para o banco
            await pool.query('INSERT INTO users(name, email, password, isAdmin, isStudent) VALUES($1, $2, $3, $4, $5);',
                [name, email, password, statusAdmin, role]
            );
            //resposta em JSON
            return res.status(201).send({
                message: 'registered with success'
            });
        } catch (e) {
            //retorno do erro em JSON
            return res.status(500).json({
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

    if (typeof name !== 'string') {
        errors.push('nome_inválido');
    } else if (name.length < 3) {
        errors.push('nome_curto_demais');
    }

    if (typeof email !== 'string') {
        errors.push('email_inválido');
    } else if (email.length < 10) {
        errors.push('email_inválido');
    } else if (!verifyEmail(email, '@sp.senai.br') || !verifyEmail(email, '@aluno.senai.br')) {
        errors.push('domínio_inválido');
    }

    if (password.length < 8) {
        errors.push('senha_deve_ter_8_no_mínimo_caracteres');
    } else if (password.split('').includes(special)) {
        errors.push('senha_deve_ter_caracteres_especiais');
    }

    let statusAdmin;
    switch (isAdmin) {
        case 'admin':
            statusAdmin = true;
            break;
        case 'user':
            statusAdmin = false;
        default:
            errors.push('status_inválido');
            break;
    }

    let role;
    switch (isStudent) {
        case 'student':
            role = true;
            break;
        case 'educator':
            role = false;
            break;
        default:
            errors.push('cargo_inválido');
            break;
    }

    if (errors.length !== 0) {
        return res.status(400).send({
            errors: errors
        });
    } else {

        try {
            //requisição para o banco
            await pool.query('UPDATE users SET name=$1, email=$2, isAdmin=$3, isStudent=$4 WHERE email=$5;',
                [name, email, statusAdmin, role, emailAux]
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

//função de alterar senha
const changePassword = async (req, res) => {
    let errors = [];

    //email por params
    const { email } = req.params;
    const { password } = req.body;

    try {
        const user = (await pool.query('SELECT * FROM users WHERE email=$1;', [email])).rows;
        //verifica e o usuario existe
        if (!user) {
            return res.status(404).send({ message: 'user not found' });
        } else {

            if (password.length < 8) {
                errors.push('senha_deve_ter_8_no_mínimo_caracteres');
            } else if (password.split('').includes(special)) {
                errors.push('senha_deve_ter_caracteres_especiais');
            } else if(password == user.password) {
                errors.push('same_password');
            }

            await pool.query('UPDATE users SET password=$1 WHERE email=$2;',
                [password, email]
            );
            return res.status(200).send({ message: 'password changed' });
        }
    } catch (e) {
        return res.status(500).send({ error: e, message: 'server error' });
    }

}


module.exports = {
    getAllUsers,
    getUsersByName,
    getUserByEmail,
    getUserByRole,
    createUser,
    updateUser,
    deleteUser,
    changePassword
};