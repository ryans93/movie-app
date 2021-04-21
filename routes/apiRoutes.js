const router = require('express').Router();
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const mypw = "Gengar93";
let connection;

// query 1
router.post("/query1", async (req, res) => {
    let formData = req.body;
    console.log(req.body);
    let queryString = `%${formData.genre1}%`;
    if (formData.genre2 != "") {
        queryString += ` OR LIKE '%${formData.genre2}%'`
    }
    if (formData.genre3 != "") {
        queryString += ` OR LIKE '%${formData.genre3}%'`
    }
    console.log(queryString);
    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT AVG(AVERAGERATING), STARTYEAR FROM JPRILUTSKY.TITLE_RATINGS, JPRILUTSKY.TITLE_CREW, 
            (SELECT TCONST AS TTCONST, TITLETYPE, PRIMARYTITLE, ISADULT, STARTYEAR,
            RUNTIMEMINUTES, GENRES  
            FROM JPRILUTSKY.TITLE_BASICS WHERE STARTYEAR >= :LOW AND STARTYEAR <= :HIGH)
            WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = JPRILUTSKY.TITLE_CREW.TCONST
            AND TTCONST = JPRILUTSKY.TITLE_CREW.TCONST
            AND GENRES LIKE '${queryString}'
            GROUP BY STARTYEAR
            ORDER BY STARTYEAR ASC`,[formData.startYear, formData.endYear]
        );
        console.log(result);
        let data = [];
        /*let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data.push({ x: parseInt(tuples[i].RUNTIME), y: parseFloat(tuples[i].AVERAGE) });
        }*/
        res.json({ data: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }
    }
});

// query 2
router.post("/query2", async (req, res) => {
    let formData = req.body;
    console.log(req.body);
    let queryString = `'%${formData.actor1}%'`;
    if (formData.actor2 != "") {
        queryString += ` OR LIKE '%${formData.actor2}%'`
    }
    if (formData.actor3 != "") {
        queryString += ` OR LIKE '%${formData.actor3}%'`
    }
    console.log(queryString);
    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT AVG(AVERAGERATING), PRIMARYNAME, STARTYEAR FROM JPRILUTSKY.TITLE_BASICS, 
            JPRILUTSKY.TITLE_RATINGS, JPRILUTSKY.TITLE_PRINCIPALS, JPRILUTSKY.TITLE_CREW, AZELENSKI.NAME_BASICS
            WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = JPRILUTSKY.TITLE_PRINCIPALS.TCONST
            AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_CREW.TCONST
            AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_BASICS.TCONST
            AND AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_PRINCIPALS.NCONST
            AND (AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.DIRECTORS OR NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.WRITERS)
            AND UPPER(PRIMARYNAME) LIKE ${queryString}
            GROUP BY PRIMARYNAME, STARTYEAR`
        );
        console.log(result);
        let data = [];
        /*let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data.push({ x: parseInt(tuples[i].RUNTIME), y: parseFloat(tuples[i].AVERAGE) });
        }*/
        res.json({ data: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }
    }
});

// query 3
router.post("/query3", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });
        const result = await connection.execute(
            `SELECT STARTYEAR, AVG(RUNTIME) AS AVERAGE 
            FROM (
            SELECT STARTYEAR, CAST(RUNTIMEMINUTES AS NUMBER) AS RUNTIME FROM JPRILUTSKY.TITLE_BASICS
            WHERE VALIDATE_CONVERSION(RUNTIMEMINUTES AS NUMBER) = 1)
            WHERE STARTYEAR BETWEEN :HIGH AND :LOW 
            GROUP BY STARTYEAR ORDER BY STARTYEAR ASC`,[formData.startYear, formData.endYear]
        );
        console.log(result);
        let data = [];
        let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data.push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
        }
        res.json({ data: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }
    }
});

// query 4
router.post("/query4", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT Runtime, AVG(AVG_Rating) as AVERAGE
            FROM (SELECT CAST(T.RUNTIMEMINUTES AS NUMBER) AS Runtime, CAST(R.AVERAGERATING AS NUMBER) AS AVG_Rating
                FROM JPRILUTSKY.TITLE_BASICS T, JPRILUTSKY.TITLE_RATINGS R
                WHERE T.TCONST = R.TCONST AND (VALIDATE_CONVERSION(T.RUNTIMEMINUTES AS NUMBER) = 1) AND (VALIDATE_CONVERSION(R.AVERAGERATING AS NUMBER) = 1))
            WHERE RUNTIME BETWEEN :LOW AND :HIGH
            GROUP BY RUNTIME
            ORDER BY RUNTIME ASC `, [formData.minRunTime, formData.maxRunTime]
        );
        console.log(result);
        let data = [];
        let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data.push({ x: parseInt(tuples[i].RUNTIME), y: parseFloat(tuples[i].AVERAGE) });
        }
        res.json({ data: data });
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        }
    }
});

module.exports = router;