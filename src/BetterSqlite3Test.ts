import Database from "better-sqlite3";
import path from "path";

export class BetterSqlite3Test {

    public static run() {
        const db = new Database("better.db", { verbose: console.log });
        const extPath = path.resolve("./lib/");
        console.log(extPath);

        const dictPath = path.join(extPath, "dict");
        console.log("extension path: " + extPath + ", dict path: " + dictPath);
        // load extension
        const platform = process.env.npm_config_target_platform || process.platform;
        if (platform === 'win32') {
            db.loadExtension(path.join(extPath, "simple"));
        } else {
            db.loadExtension(path.join(extPath, "libsimple"));
        }

        // set the jieba dict file path
        db.prepare("select jieba_dict(?)").pluck().get(dictPath);
        // create table
        db.exec("CREATE VIRTUAL TABLE t1 USING fts5(x, tokenize = 'simple')");
        // insert some data
        db.exec("insert into t1(x) values ('周杰伦 Jay Chou:我已分不清，你是友情还是错过的爱情'), ('周杰伦 Jay Chou:最美的不是下雨天，是曾与你躲过雨的屋檐'), ('I love China! 我爱中国！我是中华人民共和国公民！'), ('@English &special _characters.\"''bacon-&and''-eggs%')");

        const row1 = db.prepare("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match jieba_query(?)").get("zjl");
        console.log(row1.id + ": " + row1.info);
        const row2 = db.prepare("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match simple_query(?)").get("中国");
        console.log(row2.id + ": " + row2.info);
        const row3 = db.prepare("select rowid as id, simple_highlight(t1, 0, '[', ']') as info from t1 where x match jieba_query(?)").get("中国");
        console.log(row3.id + ": " + row3.info);
    }
}