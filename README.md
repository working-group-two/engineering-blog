# engineering blog
The source code for engineering.wgtwo.com

## Setup
https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/

or use the docker container:
```
$ docker build -t wg2blog .
$ docker run -v $PWD:/srv/jekyll -p 4000:4000 wg2blog
```


## Writing using Markdown
https://help.github.com/articles/basic-writing-and-formatting-syntax/

## Editing content

**WARNING: All edits and pull-requests are publicly recorded, never enter confidential information here**

The different pages can be found in the [pages](https://github.com/omnicate/omnicate.github.io/tree/master/pages) dir. You can edit these directly on GitHub: 

* Click the file you want to edit
* Click the pen-icon in the top right corner 
* Edit the file (there's a preview option in the top left corner)
* When you're done, write a short message explaining what you did (in the "Commit changes" section)
* Click "Commit changes"
