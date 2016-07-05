# googlebooks_search.py
# Purpose: Use the Google Books API to return info about books, based on the
# user request.
# Authors: Halle Rubera and Darlene Harsono
# Date:

"""
Credits:
The Google Book API application was written by Eni Mustafaraj for the Fall 2015 
version of CS 111.
Lyn Turbak took the application and converted into a task for PS 10.
"""

import requests
import json
import jinja2, webbrowser, os
import googlebookstemplate
reload(googlebookstemplate)
from googlebookstemplate import gBooksTemplate

###############################################################################
# Provided Helper Functions

def writeJSONforExploration(jsonData, filename):
    """Write results as JSON to explore them."""
    with open(filename, 'w') as fw:
        json.dump(jsonData, fw, sort_keys= True, indent=2)
        

def fillHTMLTemplate(templateString, paramsDict):
    """Invokes the jinja2 methods to fill in the slots in the template."""
    templateObject = jinja2.Template(templateString)
    htmlContent = templateObject.render(paramsDict)
    return htmlContent


def writeHTMLFile(htmlText, filename):
    """Helper file to write the HTML file from the given text. It uses the
       codecs module, which can deal correctly with UTF8 encoding.
    """
    import codecs
    with codecs.open(filename, 'w', 'utf8') as htmlFile:
        htmlFile.write(htmlText)


def openBrowserForHTMLFile(HTMLfilename):
    '''Open a browser to display the HTML in the file named HTMLfilename'''
    URL = 'file:' + os.getcwd() + '/' + HTMLfilename
    print '\n\n\Opening web page', URL
    webbrowser.open(URL)


###############################################################################
# Flesh out the following functions

def requestBooks(titleSearchString):
    """Prepares the request for the Web API and checks the returned response.
       If the response status code is 200, prints 'We got a response from the 
       API!' and returns the content part of the response as a string. 
       Otherwise, prints the status code, reason, and text of the response, 
       returning None. 
    """
    baseURL = "https://www.googleapis.com/books/v1/volumes"
    # flesh out
    httpResp=requests.get(baseURL,
    params={'q':'intitle:'+titleSearchString,
            'langRestrict': 'en',
            'maxResults': 40
            })
    
    if httpResp.status_code == 200:
        print "We got a response from the API!"
        return httpResp.content
    else:
        print "Request not fulfilled"
        print httpResp.status_code, httpResp.reason, httpResp.text
    
    
    
#stringResponseFromAPI=requestBooks('summer')
def extractBookInfo(stringResponseFromAPI):
    """Takes the string response from the API, converts it to a Python value,
       extracts the info needed for the HTML template and returns it in a 
       dictionary with keys 'totalCount' (the total number of items in the 
       Google Books database), 'displayCount' (the number of books to be 
       displayed on the HTML page), and 'booksList' (a list of dictionaries, 
       one for each book result that has a cover image). Assumes that the user 
       has already explored the data and knows what fields to extract, e.g., by 
       using writeJSONforExploration.
    """
    # flesh out
    queryResult = json.loads(stringResponseFromAPI)
    totalCount=queryResult['totalItems']
    items=queryResult['items']
    booksList=[] 
    for item in items:
        book=item['volumeInfo']
        if book['readingModes']['image']==True:
            if 'publishedDate' in book:
                publishDate=book['publishedDate']
            else:
                publishDate='missing'
            if 'description' in book:
                description=book['description']
            else:
                description='N/A'
            if 'pageCount' in book:
                pageCount=book['pageCount']
            else:
                pageCount='missing' 
            if 'title' in book:
                title=book['title']
            else:
                title='Untitled'
            if 'authors' in book:
                authors=book['authors']
            else:
                authors='Unknown'
            if 'publisher' in book:
                publisher=book['publisher'] 
            else:
                publisher='Who knows?'  
            bookDict={'title': title,
                    'authors' :authors,
                    'publisher':publisher,
                    'publishDate': publishDate,
                    'pageCount':pageCount,
                    'image': book['imageLinks']['smallThumbnail'],
                    'description':description,
                    'Preview': book['previewLink']}
            booksList.append(bookDict)                 
        
    resultsDict={'totalCount':totalCount,
                 'displayCount':len([item for item in items]),
                 'len': len(booksList),
                 'booksList':booksList 
                }
    
    return resultsDict
        
#stringResponseFromAPI=requestBooks('summer')
#resultsDict=extractBookInfo(stringResponseFromAPI)
def sortByPublishedDate(listOfBookDicts):
    """Given a list of dictionaries with book information, returns a new list 
       with the same elements sorted in reverse chronological order by 
       publication year. All books with missing publication years should
       appear at the end of the sorted list. Two books with the same 
       publication year info should have the same relative order in the 
       output list that they have in the input list. 
   """
    # listOfBookDicts is resultsDict from above
   
   
    newList=[] #List for sorted dates
    other=[] #List for 'missing' dates
    for item in listOfBookDicts: 
        if item== 'booksList':  #Looks at key 'booksList'
            for bookDict in listOfBookDicts[item]: #for each book dictionary
                if bookDict.get('publishDate') != 'missing':
                    tuples=(bookDict.get('publishDate'),bookDict) #gets publish date and makes tuple of date,book dict
                    newList.append(tuples)
                else:
                    some=(bookDict.get('publishDate'),bookDict) #makes tuple of missing, book dict
                    other.append(some)
    sort=sorted(newList, reverse=True) #sorts in reverse
    final=[]
    for item in sort:
        final.append(item[1]) #appends the book dict and not publish date
    for item in other:
        final.append(item[1]) #appends the book dict and not 'missing'
    return final
    #This creates one list of book dictionaries in which the most recent published books are first and
    #Missing dates go last
    

def main():
    """Prompts the user for a search term (possibly containing multiple words
       separated by spaces), and then looks up this search term in the 
       Google Books web API. If the response status code is not 200, does
       nothing. Otherwise does the following:
     
           1. Writes a file named book4<search term>.json that contains the
              formatted JSON for the response, where <search term> is replaced
              by the actual search term, without spaces. E.g. for the search
              term 'joy luck', writes the file book4joyluck.json. Use the
              helper function writeJSONforExploration for this purpose. 

           2. Extracts relevant information from the response and uses
              this to fill the template gBooksTemplate to create the 
              HTML file named book4<search term>.html that is structured
              as specified in the PS10 problem description. E.g. for the search
              term 'joy luck', generates the file book4joyluck.html. 
              Use the helper functions fillHTMLTemplate and 
              writeHTMLFile in this step. 

           3. Opens a browser on the file generated in step 2. 
              Use the helper function openBrowserForHTMLFile in this step.
    """
    # flesh out
    
    titleSearchString=raw_input('What is the title of your book?')
    stringResponseFromAPI=requestBooks(titleSearchString)
    resultsDict=extractBookInfo(stringResponseFromAPI)
    results=sortByPublishedDate(resultsDict)
    resultsDict['booksList']=results
    #This replaces the original books List with the sorted one 
    
    searchDict={'q':titleSearchString,
                'results': resultsDict
                }
      
    htmlText=fillHTMLTemplate(gBooksTemplate, searchDict)
    otherName='book4'+titleSearchString+'.json'
    writeJSONforExploration(searchDict,otherName)
    filename='book4' + titleSearchString+ '.html' 
    writeHTMLFile(htmlText, filename)
    openBrowserForHTMLFile(filename)           
    


#Uncomment the invocation of the main function below
if __name__ == '__main__':
    main()
