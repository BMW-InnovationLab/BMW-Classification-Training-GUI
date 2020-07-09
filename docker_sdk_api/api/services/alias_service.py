import sqlite3

class AliasService():

    def __init__(self):
        self.conn = sqlite3.connect('./data/aliases.db')


    def add_alias(self, name: str, alias: str):
        c = self.conn.cursor()
        c.execute("CREATE TABLE IF NOT EXISTS aliasTable (name, alias)")
        
        data = (name, alias)
        c.execute("INSERT INTO aliasTable VALUES (?,?)", data)

        self.conn.commit()

    



    def get_name_from_alias(self, alias: str):
        try:
            c = self.conn.cursor()

            data = (alias,) 

            c.execute("SELECT name FROM aliasTable WHERE alias=?", data)
            return c.fetchone()[0]

        except:
            return None


    def get_alias_from_name(self, name: str):
        try:
            c = self.conn.cursor()

            data = (name,) 

            c.execute("SELECT alias FROM aliasTable WHERE name=?", data)
            return c.fetchone()[0]
        except:
            return None



    def delete_alias(self, alias: str):
        c = self.conn.cursor()

        data = (alias,)

        c.execute("DELETE FROM aliasTable WHERE alias=?", data)
        self.conn.commit()
    
