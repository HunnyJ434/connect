// /pages/api/healthcheck.js
import { checkDbConnection } from '../../lib/dbConnect';

export default async function handler(req, res) {
    const dbHealthy = await checkDbConnection();

    if (dbHealthy) {
        res.status(200).json({ status: "Database is connected" });
    } else {
        res.status(500).json({ status: "Database connection failed" });
    }
}
