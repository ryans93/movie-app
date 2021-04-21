const router = require('express').Router();
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const mypw = "Gengar93";
let connection;

// query 1
router.post("/query1", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT AVG(AVERAGERATING) AS AVERAGE, STARTYEAR FROM JPRILUTSKY.TITLE_RATINGS, 
            (SELECT TCONST AS TTCONST, STARTYEAR, GENRES  
            FROM JPRILUTSKY.TITLE_BASICS WHERE STARTYEAR BETWEEN :LOW AND :HIGH 
            AND GENRES LIKE '%${formData.genre1}%')
            WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = TTCONST
            GROUP BY STARTYEAR
            ORDER BY STARTYEAR ASC`, [formData.startYear, formData.endYear]
        );
        console.log(result);
        let data = [[], [], []];
        let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data[0].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
        }
        if (formData.genre2 != "") {
            const result = await connection.execute(
                `SELECT AVG(AVERAGERATING) AS AVERAGE, STARTYEAR FROM JPRILUTSKY.TITLE_RATINGS, 
                (SELECT TCONST AS TTCONST, STARTYEAR, GENRES  
                FROM JPRILUTSKY.TITLE_BASICS WHERE STARTYEAR BETWEEN :LOW AND :HIGH 
                AND GENRES LIKE '%${formData.genre2}%')
                WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = TTCONST
                GROUP BY STARTYEAR
                ORDER BY STARTYEAR ASC`, [formData.startYear, formData.endYear]
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[1].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
            }
        }
        if (formData.genre3 != "") {
            const result = await connection.execute(
                `SELECT AVG(AVERAGERATING) AS AVERAGE, STARTYEAR FROM JPRILUTSKY.TITLE_RATINGS, 
                (SELECT TCONST AS TTCONST, STARTYEAR, GENRES  
                FROM JPRILUTSKY.TITLE_BASICS WHERE STARTYEAR BETWEEN :LOW AND :HIGH 
                AND GENRES LIKE '%${formData.genre3}%')
                WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = TTCONST
                GROUP BY STARTYEAR
                ORDER BY STARTYEAR ASC`, [formData.startYear, formData.endYear]
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[2].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
            }
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

// query 2
router.post("/query2", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT AVG(AVERAGERATING) AS AVERAGE, PRIMARYNAME, STARTYEAR FROM JPRILUTSKY.TITLE_BASICS, 
            JPRILUTSKY.TITLE_RATINGS, JPRILUTSKY.TITLE_PRINCIPALS, JPRILUTSKY.TITLE_CREW, AZELENSKI.NAME_BASICS
            WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = JPRILUTSKY.TITLE_PRINCIPALS.TCONST
            AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_CREW.TCONST
            AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_BASICS.TCONST
            AND AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_PRINCIPALS.NCONST
            AND (AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.DIRECTORS OR NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.WRITERS)
            AND UPPER(PRIMARYNAME) = '${formData.actor1}'
            GROUP BY PRIMARYNAME, STARTYEAR ORDER BY STARTYEAR ASC`
        );
        console.log(result);
        let data = [[], [], []];
        let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data[0].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
        }
        if(formData.actor2 != ""){
            const result = await connection.execute(
                `SELECT AVG(AVERAGERATING) AS AVERAGE, PRIMARYNAME, STARTYEAR FROM JPRILUTSKY.TITLE_BASICS, 
                JPRILUTSKY.TITLE_RATINGS, JPRILUTSKY.TITLE_PRINCIPALS, JPRILUTSKY.TITLE_CREW, AZELENSKI.NAME_BASICS
                WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = JPRILUTSKY.TITLE_PRINCIPALS.TCONST
                AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_CREW.TCONST
                AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_BASICS.TCONST
                AND AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_PRINCIPALS.NCONST
                AND (AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.DIRECTORS OR NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.WRITERS)
                AND UPPER(PRIMARYNAME) LIKE ${formData.actor2}
                GROUP BY PRIMARYNAME, STARTYEAR`
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[1].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
            }
        }
        if(formData.actor3 != ""){
            const result = await connection.execute(
                `SELECT AVG(AVERAGERATING) AS AVERAGE, PRIMARYNAME, STARTYEAR FROM JPRILUTSKY.TITLE_BASICS, 
                JPRILUTSKY.TITLE_RATINGS, JPRILUTSKY.TITLE_PRINCIPALS, JPRILUTSKY.TITLE_CREW, AZELENSKI.NAME_BASICS
                WHERE JPRILUTSKY.TITLE_RATINGS.TCONST = JPRILUTSKY.TITLE_PRINCIPALS.TCONST
                AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_CREW.TCONST
                AND JPRILUTSKY.TITLE_PRINCIPALS.TCONST = JPRILUTSKY.TITLE_BASICS.TCONST
                AND AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_PRINCIPALS.NCONST
                AND (AZELENSKI.NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.DIRECTORS OR NAME_BASICS.NCONST = JPRILUTSKY.TITLE_CREW.WRITERS)
                AND UPPER(PRIMARYNAME) LIKE ${formData.actor3}
                GROUP BY PRIMARYNAME, STARTYEAR`
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[2].push({ x: parseInt(tuples[i].STARTYEAR), y: parseFloat(tuples[i].AVERAGE) });
            }
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
            SELECT STARTYEAR, CAST(RUNTIMEMINUTES AS NUMBER) AS RUNTIME 
            FROM JPRILUTSKY.TITLE_BASICS
            WHERE VALIDATE_CONVERSION(RUNTIMEMINUTES AS NUMBER) = 1)
            WHERE STARTYEAR BETWEEN :LOW AND :HIGH
            GROUP BY STARTYEAR ORDER BY STARTYEAR ASC`, [formData.startYear, formData.endYear]
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

// query 5
router.post("/query5", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });

        const result = await connection.execute(
            `SELECT *
            FROM (SELECT T.STARTYEAR AS RELEASEYEAR, COUNT(TCONST) AS NUMMOVIES
                FROM JPRILUTSKY.TITLE_BASICS T
                WHERE (T.TITLETYPE = 'movie') AND (T.GENRES LIKE('%${formData.genre1}%'))
                GROUP BY T.STARTYEAR)
            WHERE RELEASEYEAR BETWEEN :LOW AND :HIGH
            ORDER BY RELEASEYEAR ASC`, [formData.startYear, formData.endYear]
        );
        console.log(result);
        let data = [[], [], []];
        let tuples = result.rows;
        for (let i = 0; i < tuples.length; i++) {
            data[0].push({ x: parseInt(tuples[i].RELEASEYEAR), y: parseFloat(tuples[i].NUMMOVIES) });
        }
        if (formData.genre2 != "") {
            const result = await connection.execute(
                `SELECT *
                FROM (SELECT T.STARTYEAR AS RELEASEYEAR, COUNT(TCONST) AS NUMMOVIES
                    FROM JPRILUTSKY.TITLE_BASICS T
                    WHERE (T.TITLETYPE = 'movie') AND (T.GENRES LIKE('%${formData.genre2}%'))
                    GROUP BY T.STARTYEAR)
                WHERE RELEASEYEAR BETWEEN :LOW AND :HIGH
                ORDER BY RELEASEYEAR ASC`, [formData.startYear, formData.endYear]
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[1].push({ x: parseInt(tuples[i].RELEASEYEAR), y: parseFloat(tuples[i].NUMMOVIES) });
            }
        }
        if (formData.genre3 != "") {
            const result = await connection.execute(
                `SELECT *
                FROM (SELECT T.STARTYEAR AS RELEASEYEAR, COUNT(TCONST) AS NUMMOVIES
                    FROM JPRILUTSKY.TITLE_BASICS T
                    WHERE (T.TITLETYPE = 'movie') AND (T.GENRES LIKE('%${formData.genre3}%'))
                    GROUP BY T.STARTYEAR)
                WHERE RELEASEYEAR BETWEEN :LOW AND :HIGH
                ORDER BY RELEASEYEAR ASC`, [formData.startYear, formData.endYear]
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data[2].push({ x: parseInt(tuples[i].RELEASEYEAR), y: parseFloat(tuples[i].NUMMOVIES) });
            }
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

// query 6
router.post("/query6", async (req, res) => {
    let formData = req.body;
    console.log(req.body);

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });
        let data = [];
        if (formData.format === "Episode") {
            const result = await connection.execute(
                `WITH TEMP AS
                (SELECT TCONST FROM JPRILUTSKY.TITLE_BASICS WHERE PRIMARYTITLE = '${formData.series}')
            SELECT CAST(E.EPISODENUMBER AS NUMBER) AS EPISODENUMBER, R.AVERAGERATING
            FROM JPRILUTSKY.TITLE_EPISODE E, TEMP, JPRILUTSKY.TITLE_RATINGS R
            WHERE (E.PARENTTCONST = TEMP.TCONST) AND (E.SEASONNUMBER = '${formData.season}') AND (E.TCONST = R.TCONST) AND (VALIDATE_CONVERSION(E.EPISODENUMBER AS NUMBER) = 1)
            ORDER BY CAST(E.EPISODENUMBER AS NUMBER)`
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data.push({ x: parseInt(tuples[i].EPISODENUMBER), y: parseFloat(tuples[i].AVERAGERATING) });
            }
        }
        else {
            const result = await connection.execute(
                `WITH TEMP AS
                (SELECT TCONST FROM JPRILUTSKY.TITLE_BASICS WHERE PRIMARYTITLE = '${formData.series}')
            SELECT CAST(E.SEASONNUMBER AS NUMBER) AS SEASONNUMBER, AVG(R.AVERAGERATING) AS SEASONRATING
            FROM JPRILUTSKY.TITLE_EPISODE E, TEMP, JPRILUTSKY.TITLE_RATINGS R
            WHERE (E.PARENTTCONST = TEMP.TCONST) AND (E.TCONST = R.TCONST) AND (VALIDATE_CONVERSION(E.SEASONNUMBER AS NUMBER) = 1)
            GROUP BY CAST(E.SEASONNUMBER AS NUMBER)
            ORDER BY CAST(E.SEASONNUMBER AS NUMBER)`
            );
            console.log(result);
            let tuples = result.rows;
            for (let i = 0; i < tuples.length; i++) {
                data.push({ x: parseInt(tuples[i].SEASONNUMBER), y: parseFloat(tuples[i].SEASONRATING) });
            }
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

// query 6
router.post("/total", async (req, res) => {

    try {
        connection = await oracledb.getConnection({
            user: "rstrickler1",
            password: mypw,
            connectString: "oracle.cise.ufl.edu/orcl"
        });
        const result = await connection.execute(
            `WITH
            NBCOUNT (NAME_BASICS_COUNT) AS (SELECT COUNT(*) FROM AZELENSKI.NAME_BASICS),
            TBCOUNT (TITLE_BASICS_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_BASICS),
            TACOUNT (TITLE_AKAS_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_AKAS),
            TCCOUNT (TITLE_CREW_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_CREW),
            TECOUNT (TITLE_EPISODE_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_EPISODE),
            TPCOUNT (TITLE_PRINCIPALS_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_PRINCIPALS),
            TRCOUNT (TITLE_RATINGS_COUNT) AS (SELECT COUNT(*) FROM JPRILUTSKY.TITLE_RATINGS)
            SELECT (NBCOUNT.NAME_BASICS_COUNT + TBCOUNT.TITLE_BASICS_COUNT + TACOUNT.TITLE_AKAS_COUNT + TCCOUNT.TITLE_CREW_COUNT + TECOUNT.TITLE_EPISODE_COUNT +
            TPCOUNT.TITLE_PRINCIPALS_COUNT + TRCOUNT.TITLE_RATINGS_COUNT) AS TOTALCOUNT
            FROM NBCOUNT, TBCOUNT, TACOUNT, TCCOUNT, TECOUNT, TPCOUNT, TRCOUNT`
        );
        console.log(result);
        res.json({ data: result.rows[0].TOTALCOUNT });
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