const pool = require('../database/database.config');

const getLocalsWithRequests = async (req, res) => {
    try {
        const response = await pool.query(`SELECT local, COUNT(*) AS quantity FROM requests GROUP BY local;`);
        if (response.rowCount > 0) {
            res.status(200).send(response.rows);
        } else {
            res.status(404).send({ message: 'nenhuma_solicitação' });
        }
    } catch (e) {
        return res.status(500).send({
            error: 'Error: ' + e,
        });
    }
}

const getDataFromRequests = async (req, res) => {
    try {
        const response = await pool.query(`
SELECT
    TO_CHAR(CURRENT_DATE, 'YYYY-MM') AS this_month,
    COUNT(*) FILTER (WHERE date_trunc('month', date_request) = date_trunc('month', CURRENT_DATE)) AS reqs_this_month,
    COUNT(*) FILTER (
        WHERE date_trunc('month', date_request) = date_trunc('month', CURRENT_DATE)
        AND status_request = 'conclued'
    ) AS attended_reqs_this_month,
    TO_CHAR(CURRENT_DATE - INTERVAL '1 month', 'YYYY-MM') AS last_month,
    COUNT(*) FILTER (WHERE date_trunc('month', date_request) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')) AS reqs_last_month,
    COUNT(*) FILTER (
        WHERE date_trunc('month', date_request) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
        AND status_request = 'conclued'
    ) AS attended_reqs_last_month
FROM
    requests;

            `);

    if(!response.rowCount) {
        return res.status(404).send({ error: 'Não foram encontradas solicitações' });
    } else {
        return res.status(200).send( response.rows );
    }

    } catch (e) {
        return res.status(500).send({
            error: 'Error: ' + e,
        })
    }
}

module.exports = { getLocalsWithRequests, getDataFromRequests }