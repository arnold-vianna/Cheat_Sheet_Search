<p align=center>
  <br>
  <a href="https://github.com/arnold-vianna?tab=repositories" target="_blank"><img src="https://avatars.githubusercontent.com/u/113808475?v=4"/></a>
  <br>
  <span>check out my website <a href="https://arnold-vianna.github.io/">arnold-vianna.github.io</a></span>
  <br>
</p>



# Cheat Sheet Search Script With Web-UI

<a href="https://imgur.com/heaERZL"><img src="https://imgur.com/heaERZL.png" title="source: imgur.com" /></a>

## Key Features 
* Database is all Preinstalled Mysqlit

* Add more cheat sheets fast & easy

* Search By Command or Description or by 

* Filter by theme 

* run with 4 commands 



## Install Via Docker Without The Github Repo


```console
docker pull arnoldvianna/cheat_sheet
```

```console
docker run -d -p 8010:8010 arnoldvianna/cheat_sheet
```

```console
http://0.0.0.0:8010/
```




## Install Via Docker With The Github Repo

```console
git clone https://github.com/arnold-vianna/Cheat_Sheet_Search.git
```

```console
cd Cheat_Sheet_Search
```

```console
docker-compose up -d
```

```console
http://127.0.0.1:8010/
```






## Install On Linux

```console
git clone https://github.com/arnold-vianna/Cheat_Sheet_Search.git
```

```console
cd Cheat_Sheet_Search
```

```console
pip install -r requirements.txt
```

```console
gunicorn -w 2 -b 0.0.0.0:5800 app:app
```

```console
http://0.0.0.0:5800
```

## Usage

* Cheat sheets are sorted and named  as (Theme)

* click create new (Theme) and it will be made inside of the Mysqlite

* Can also remove any any (Theme) made via CRUD buttons on the website 

* Or you can delete one entry at a time 



* All functions are on the (web-UI)   




## Key Features

* No configuration needed 

* Can add remove commands or whole cheat sheets

* Easy to understand menu




## Ethical and Legal Considerations

Please use this tool responsibly and ensure that The CheatSheetSearch script is designed to provide a utility for searching through cheat sheets stored in JSON files. It is intended for educational and informational purposes only.

## Disclaimer

The author and contributors are not responsible for any misuse or illegal activities facilitated by this tool. Be aware of and comply with the laws and regulations in your jurisdiction.

By using the CheatSheetSearch script, the user agrees to these ethical and legal considerations.
