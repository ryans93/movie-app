const express = require('express');
const oracledb = require('oracledb');
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const PORT = 3001;

try {
    oracledb.initOracleClient({ libDir: '/Users/ryanstrickler/Downloads/instantclient_19_8' });
} catch (err) {
    console.error(err);
    process.exit(0);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, async () => {
    console.log(`Listening on PORT: ${PORT}`);
});