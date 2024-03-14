<p align=center>
  <br>
  <a href="https://github.com/arnold-vianna?tab=repositories" target="_blank"><img src="https://avatars.githubusercontent.com/u/113808475?v=4"/></a>
  <br>
  <span>check out my website <a href="https://arnold-vianna.github.io/">arnold-vianna.github.io</a></span>
  <br>
</p>



# Cheat Sheet Search Script With Web-UI

<a href="https://imgur.com/ixbbiW2"><img src="https://i.imgur.com/ixbbiW2.png" title="source: imgur.com" /></a>

## Live Demo

* https://demo.arnold-tech.online/

## Key Features 
* Add more cheat sheets fast & easy

* Search By Command or Description or by 

* Filter by cheat sheet 

* run with 4 commands 




## Install & run

```console
git clone https://github.com/arnold-vianna/Cheat_Sheet_Search.git
```

```console
cd Cheat_Sheet_Search
```


```console
python3 app.py
```

```console
http://127.0.0.1:5000
```


## use with gunicorn

* To use out of in the background 

* Remeber to change ip and port as needed 

```console
nohup gunicorn -w 4 -b 192.168.1.5:5000 app:app &
```

* To stop

```console
pkill gunicorn
```


## Usage

* Add more cheat sheets in .json and it will read them automatically

* Add more cheat sheets by

* make a .json file with the desired cheat sheet with commands and description

* Then name it as shown below and it will read it automatically. remember to replace the CHANGEME with the cheat sheet name

* CHANGEME_cheatsheet.json

* and save the new_cheatsheet.json to the same dir as the others  




## Key Features

* Can search by three manners

* Command, Description, Code Language filter,

* Easy to understand menu




## Ethical and Legal Considerations

Please use this tool responsibly and ensure that The CheatSheetSearch script is designed to provide a utility for searching through cheat sheets stored in JSON files. It is intended for educational and informational purposes only.

## Disclaimer

The author and contributors are not responsible for any misuse or illegal activities facilitated by this tool. Be aware of and comply with the laws and regulations in your jurisdiction.

By using the CheatSheetSearch script, the user agrees to these ethical and legal considerations.
