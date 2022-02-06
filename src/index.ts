import sqlite3 from "sqlite3";
import path from "path";

const db = new sqlite3.Database(":memory:")

db.serialize(function () {
    const extPath = path.resolve("./lib/");
    console.log(extPath);

    const dictPath = path.join(extPath, "dict");
    console.log("extension path: " + extPath + ", dict path: " + dictPath);
    // load extension
    const platform = process.env.npm_config_target_platform || process.platform

    const dbExt = db as any;
    if (platform === 'win32') {
        dbExt.loadExtension(path.join(extPath, "simple"));
    } else {
        dbExt.loadExtension(path.join(extPath, "libsimple"));
    }
    // set the jieba dict file path
    db.run("select jieba_dict(?)", dictPath);
    // create table
    db.run("CREATE VIRTUAL TABLE t1 USING fts5(x, tokenize = 'simple')");
    // insert some data
    db.run("insert into t1(x) values ('周杰伦 Jay Chou:我已分不清，你是友情还是错过的爱情'), ('周杰伦 Jay Chou:最美的不是下雨天，是曾与你躲过雨的屋檐'), ('I love China! 我爱中国！我是中华人民共和国公民！'), ('@English &special _characters.\"''bacon-&and''-eggs%')");

    // with match 周杰伦
    db.each("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match simple_query('zjl')", function (err, row) {
        console.log(row.id + ": " + row.info);
    });
    // will match 中国 and 中华人民共和国
    db.each("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match simple_query('中国')", function (err, row) {
        console.log(row.id + ": " + row.info);
    });
    // will match 中国 but not 中华人民共和国
    db.each("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match jieba_query('中国')", function (err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();

console.log("hello world");