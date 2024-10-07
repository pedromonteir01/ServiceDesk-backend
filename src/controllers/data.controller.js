const pool = require('../database/database.config');

const getLocalsWithRequests = async (req, res) => {
    try {
        const response = await pool.query(`SELECT local, COUNT(*) AS quantity FROM requests GROUP BY local;`);
        if(response.rowCount > 0) {
            res.status(200).send(response.rows);
        } else {
            res.status(404).send({ message: 'nenhuma_solicitação' });
        }
    } catch (e) {
        return res.status(500).send({
            error: 'Error: ' + e,
            message: 'Error in post user'
        });
    }
}

module.exports = { getLocalsWithRequests }