# HTML jinja2 template for Google Book search task


__author__ = 'Darlene and Halle'

#write your HTML template in the variable below
#template=jinja2.Template
#template.render(title=titleSearchString)
#Questions for SOhie:
#What is jinja2?
#How do make title in {{}} w/o it being spelled out
#How to do parameters for resultsDict
gBooksTemplate = """
<html>
<head>
  <meta charset="UTF-8">
  <title>Searching Google Books</title>
  <link href='http://fonts.googleapis.com/css?family=Economica:400,700' rel='stylesheet'>
  <link rel="stylesheet" href="style.css">
</head>
<div class="body">
<h1>Searching Google Books</h1>
<h2>Your search query: <b>{{q}}</b>  - has a total of {{results['totalCount']}} entries.</h2>
<h2> Below are the first {{results['len']}} books</h2>

{% for item in results['booksList'] %}
<div class="book img">     
    <div id="main">
    <b>{{item['title']}}</b> - <span> {{item['authors']}} </span>
    </div>
    <img src="{{item['image']}}">  
    <div id='main'>
    <p> Published Date:<b>{{item['publishDate']}}</b> Page Count: {{item['pageCount']}} </p>  
     
    
     {{item['description']}}
     </p>
     <a href="{{item['Preview']}}">Go to Preview</a><br>

     </div>
     </div>     
   

{% endfor %}
</div>

</html>
"""