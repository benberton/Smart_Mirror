import json
import requests
import pandas as pd
import numpy as np

##############################################
# Programmer: Jaylene Baltazar
# Class: CPSC 222, Spring 2022
# Data Assignment #4
# 3/15/2022
# I did not attempt the bonus.
# 
# Description: This program will call MeteoStat and MapQuest APIs and gather data from 
# a large city of the user's choice. Both the uncleaned data and cleaned data will be written 
# to two seperate csv files.
# In github, I included two example csv files that this program will produce (example city is San Jose).
##############################################


# URLs to help with api documentation/info
    # meteostat quick start: https://dev.meteostat.net/api/#quick-start
    # mapquest documentation: https://developer.mapquest.com/documentation/ 


# MapQuest and MeteoStat API documentation:

# Map Quest API
mq_api_key = "5pqsNVcNGrzfyzRqRAnegOFKqkgIdSOK"  # consumer key, will be used later in #2

# MeteoStat API
headers = {"x-rapidapi-host" : "meteostat.p.rapidapi.com" , "x-rapidapi-key": "0a5c4507e1mshff342be8a3b703dp11aa80jsn355bf2156dc2"}   # consumer key (x-rapidapi-key)
urlMt = "https://rapidapi.com/meteostat/api/meteostat/"       # rapid api site from meteostat
meteo_response = requests.get(url=urlMt, headers=headers)
json_meteo_str = meteo_response.text    # loading into json string
# print("******", json_meteo_str, "*******")   #test



# 1. Prompt the user for the name of a large city
    # If there are spaces in the name, replace them with +
users_city = input("Enter the name of a large city: ")
def replace_space(users_city):  # will accept the variable
    '''
    Function def replace_space(users_city)
    Parameter: city the user entered
    This function will take in the user's city and join the words with a "+"
    Returns updated users city name
    '''
    return ("+".join(users_city.split( )))      #.split() to seperate elements, .join to connect them with +
users_city = replace_space(users_city)      # call/execute funciton
# print(users_city)       # test



# 2. Using the user-entered city, make a request to MapQuest to get the city's latitude and longitude
    # Use the API key we made in class for MapQuest
    # Extract the city's latitude and longitude. Store these in variables.
urlMq = "https://www.mapquestapi.com/geocoding/v1/address"
prmMq = {"key" : mq_api_key, "location" : users_city}       # parameter mapquest, parameters will allow user to get the location
mapquest_response = requests.get(urlMq, params = prmMq)
# print(mapquest_response)    #test, note: variable name length is long, shorten for future to make easy
# print(mapquest_response , len(mapquest_response.text) , mapquest_response.text[ : 80] , mapquest_response.text[-80 : ])     #test, print the first 80 characters and the last 80 character... printing the whole thing is long
jsnMq = json.loads(mapquest_response.text)      # load into jsnMq(json mapquest variable)
# print("PART 2, JSON KEYS PRINT", jsnMq.keys( ), jsnMq["results"][0].keys( ), "END HERE")    # test, to figure out the keys, then also the ones in "results"
# print("TESTING", jsnMq["results"][0]["locations"][0]["latLng"], "END HERE")     # test, keys are correct, gets long and lat
lat, lon = jsnMq["results"][0]["locations"][ 0 ]["latLng"].values( )     # dictionary reference (for visuals/determining where it is): https://developer.mapquest.com/documentation/geocoding-api/address/get/
# print(users_city, lat, lon)     #test
# Store/Update longitude and latitude variables:
lat = jsnMq["results"][ 0 ]["locations"][ 0 ]["latLng"]["lat"]
lon = jsnMq["results"][ 0 ]["locations"][ 0 ]["latLng"]["lng"]



# 3. Using the latitude and longitude variables, make a request to MeteoStat to get the coordinates' station ID
    # Extract the city's weather station ID. Store this in a variable.

urlMt2 = "https://meteostat.p.rapidapi.com/stations/nearby"     #url variable to meteostat. The url needed is different from the last one so can't use the same variable
qryMt2 = {"lat" : lat, "lon" : lon}      # query string for meteostat
rspMt2 = requests.get(urlMt2, headers = headers, params = qryMt2)       # response to request
# print("#3 TESTING HERE", rspMt2, len(rspMt2.text), rspMt2.text[ : 80], rspMt2.text[-80 : ], "END TEST FOR 3")     #test, print the first and last 80 char
jsnMt2 = json.loads(rspMt2.text)      # converting to json
# print(jsnMt2.keys( ), len(jsnMt2["data"]))  # test
# Weather Station ID variable here:
wid = jsnMt2["data"][0]["id"]     # wid = weather id. How to find the weather station id: https://dev.meteostat.net/api/stations/nearby.html#example


# 4. Using your weather station ID variable, get daily weather data for the previous year (2021-02-21 through 2022-02-20)
    # Set the units to be imperial to get Fahrenheit instead of Celsius
    # Structure this data nicely into a pandas' DataFrame

urlMt3 = "https://meteostat.p.rapidapi.com/stations/daily"
qryMt3 = {"station" : wid , "start" : "2021-02-21" , "end" : "2022-02-20" , "units" : "imperial" }     # imperial = deg in F,  reference for the dictionary: https://dev.meteostat.net/api/stations/daily.html#response
rspMt3 = requests.get(urlMt3 ,headers = headers ,params = qryMt3)      #variable name rspMt3 = response number 3 for MeteoStat
# print(rspMt3, len(rspMt3.text), rspMt3.text[ : 80], rspMt3.text[-80 : ])       #test, print the first 80 characters and the last 80 characters
jsnMt3 = json.loads(rspMt3.text)     # load into json
# print(jsnMt3.keys( ), len(jsnMt3["data"]))       # test: print the keys

# Structure this data into a pandas' DataFrame:
city_weather_df = pd.DataFrame(jsnMt3["data"])
# city_weather_df.to_csv("example_just_testing.csv")    # test

# Another way to grab the data (not used but still functional)(ONLY grabs tavg):
# data = []
# temp_avg = [] #	empty list to be filled from jsnMt3
# for i in range(len(jsnMt3["data"])):
#     data.append(jsnMt3["data"][ i ]["date"])
#     temp_avg.append(jsnMt3["data"][ i ]["tavg"])
# print(len(data) , len(temp_avg) , temp_avg[ : 3] , temp_avg[-3 : ])     # test
# city_weather_df = pd.DataFrame({"date" : data , "tavg" : temp_avg} , columns = ["date" , "tavg"])	#	https://stackoverflow.com/questions/30522724/take-multiple-lists-into-dataframe
# print("**************", city_weather_df.shape , city_weather_df[ : 3] , city_weather_df.isna( ).any( ) , city_weather_df.isnull( ).sum( ) )	#	https://stackoverflow.com/questions/29530232/how-to-check-if-any-value-is-nan-in-a-pandas-dataframe
# Structure this data into a pandas' DataFrame:
# #	city_weather_df = pd.DataFrame(jsnMt3, columns = ["Date", "Temp in F"])	#	WRONG: CAN'T JUST transform json type into dataframe; must extract data into list or series and input into pd.dataFrame as above
# # print("TESTING CITY_WEATHER_DF", city_weather_df, city_weather_df.shape, "END HERE")      #test
# print("TESTING CITY_WEATHER_DF", city_weather_df.head( ) , city_weather_df.shape, "END HERE")      #test



# 5. Write the DataFrame to a csv file using the filename convention: <city name>_daily_weather.csv
city_weather_df.index.name = "id"
city_weather_df.to_csv(users_city + "_daily_weather.csv") # write weather DataFrame to csv (this data is not cleaned)



# 6. Clean the DataFrame so there are no missing values
    # Remove columns with more than 50% of data missing
    # Fill the remaining missing values
        # "Middle" values should be filled with linear interpolation (see interpolate())
        # Since you can't interpolate the first or last values if they are missing, using backfilling and forward filling appropriately (see fillna())

# Remove columns with more than 50% missing:
city_weather_df.replace("?", np.NaN, inplace = True)    # first fill the column's missing data with NaN
# print(city_weather_df.columns[city_weather_df.isnull().any()])     # the columns with missing data
# print(city_weather_df.columns[city_weather_df.isnull().sum())      # how many missing from each column
for column in city_weather_df:
    column, city_weather_df[column].isnull().sum()
    if city_weather_df[column].isnull().sum()*100/city_weather_df.shape[0] > 50:        # aka if the number of missing data is greater than 50% delete it
        city_weather_df.drop(column, axis=1, inplace=True)      # need to put axis=1 instead of 1 bc it will not be supported in future versions: https://stackoverflow.com/questions/69901618/question-regarding-futurewarningin-a-future-version-of-pandas-all-arguments-o 
city_weather_df.reset_index(inplace=True, drop=True)    # reset the index after dropping some rows
# print(city_weather_df.head(2))  # test

# Fill the remaining missing values:
city_weather_df.interpolate()       # will replace the middle calues with the mean of the pervious and next value
# Backfilling and forward filling:
city_weather_df.fillna(method="bfill", inplace=True)    # to fill in the top rows with the data value below it
city_weather_df.fillna(method="ffill", inplace=True)    # to fill in bottom rows with the data value above it



# 7. Write the cleaned DataFrame to a csv file using the filename convention: <city name>_daily_weather_cleaned.csv
city_weather_df.index.name = "id"
city_weather_df.to_csv(users_city + "_daily_weather_cleaned.csv")   # write weather DataFrame to csv (this data is cleaned)

