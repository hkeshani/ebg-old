from __future__ import print_function
import flask
from flask import Flask, request, send_from_directory, send_file, redirect, json, url_for
import os
import sys
import csv
from flask_mysqldb import MySQL, MySQLdb
import httplib
import time

app = Flask(__name__)

dbCreated = False

app.config['MYSQL_USER'] = 'islamicgarden'
app.config['MYSQL_PASSWORD'] = '5fa9E&xtfu'
app.config['MYSQL_DB'] = 'islamicgarden'
app.config['MYSQL_SQL_MODE'] = "NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION"


#app.config['MYSQL_HOST'] = os.environ["OPENSHIFT_MYSQL_DB_HOST"]
mysql = MySQL(app)

#before_first_request runs more than once for some reason.
#so I'm making a global counter to make sure it only does it once

#conn = mysql.connect()
"""@app.before_request
def before_request():

	#print(request.url)
	if request.url.startswith('http://'):
	#if not request.is_secure:
	    url = request.url.replace('http://', 'https://', 1)
	    code = 301
	    redirect(url, code=code)
"""
#homepage
@app.route("/")
def index():
    #print(os.listdir('ebg/html'), file=sys.stderr)
	print("DOES THIS WORK??", file=sys.stderr)
	return send_from_directory("ebg/html" , "index.html")

@app.route("/api/sounds")
def soundsEndpoint():
	if "placemarkName" in request.args:
		soundsList = []
		location = request.args["placemarkName"]
		cur = mysql.connection.cursor()
		cur.execute("""SELECT s.sound_path, s.sound_id , s.one_line_desc, s.audio_type
						FROM islamicgarden.sounds s
						WHERE s.placemark_name = '""" + location + "'")

		result = cur.fetchall()

		#return json.dumps(result[0])
		locationJSON = {'placemarkName':location}
		soundsList.append(locationJSON);
		for track in result:
			jsonObj = {'path': track[0],
						"track_id":track[1],
						"one_line_desc":track[2],
						"trackType":track[3]
						}

			soundsList.append(jsonObj)

		return json.dumps(soundsList);

	else:
		return json.dumps({'error':'invalid args in url'})



@app.route("/api/descriptions")
def descriptionsEndpoint():
	if "track_id" in request.args:
		descList = []
		track_id = request.args['track_id']

		curs = mysql.connection.cursor()
		curs.execute(""" SELECT d.general_desc, d.inst_desc_path, d.musician_desc_path, d.lyrics_original , d.lyrics_translit, d.lyrics_translation , d.one_line_desc
						FROM islamicgarden.descriptions d
						WHERE d.sound_id = """ + track_id)


		results = curs.fetchall()
		for totalDescription in results:
			descriptionObj = {"text_desc":totalDescription[0],
							"inst_desc":totalDescription[1],

							 }
			descList.append(descriptionObj)
		return json.dumps(descList)
	else:
		return json.dumps({"error":"invalid args in url"})

@app.route("/api/pictures")
def pictureEndpoint():
	if "track_id" in request.args:
		pictureList = []
		track_id = request.args['track_id']

		curs = mysql.connection.cursor()
		curs.execute("""

			SELECT p.pic_id
			FROM islamicgarden.picture_track_id p
			WHERE p.sound_id = """ + track_id + """


			""")

		results = curs.fetchall()
		pictureList = []
		curs.close()
		for picture_ids in results:
			curs = mysql.connection.cursor()
			curs.execute("""

				SELECT p.pic_path , p.image_desc
				FROM islamicgarden.pictures p
				WHERE p.pic_id = %s""",[int(picture_ids[0])]


				)
			results2 = curs.fetchall()
			#results2 is formatted like this results2 = [ [p.pic_path1 , p.image_desc2] , [p.pic_path2, p.image_desc2] ,  etc... ]

			pictureObj = {'track_id' : track_id,

						'pic_id': picture_ids[0],
						'pics' : results2

						}

			pictureList.append(pictureObj)
		return json.dumps(pictureList)
	else:
		return json.dumps({"error":"invalid args in url"})

#this serves stuff from assets and js and css
@app.route("/<path:directory>")
def serveStatic(directory):
	parse = directory.split('/')
	path = parse[0]
	print(path , file=sys.stderr)
	fileToServe = parse[len(parse)-1]
	print("-------------FILE TO SERVE --------------- " , file=sys.stderr)
	print(fileToServe, file=sys.stderr)
	if( not path.endswith(".html")):
		return send_from_directory("ebg/"+ path , fileToServe)
	else:
		return send_from_directory("ebg/html",fileToServe)


#navigating to page after homepage
# @app.route("/<page>")
# def servePage(page):
# 	print(page, file=sys.stderr)
# 	return send_from_directory("ebg/html",page)




@app.before_first_request
def makeDB():
	#db = MySQLdb.connect(user="islamicgarden", passwd="5fa9E&xtfu" , db="islamicgarden")
	global dbCreated

	if not dbCreated:
		dbCreated = True
		cur = mysql.connection.cursor()
		#just setting up the db then reading the .csv file with all the info for the tracks and associated meadia

		#make the tables in mysql


		cur.execute("DROP TABLE IF EXISTS  picture_track_id;")
		cur.close()
		cur = mysql.connection.cursor()


		cur.execute("DROP TABLE IF EXISTS pictures;")
		cur.close()
		cur = mysql.connection.cursor()

		cur.execute("DROP TABLE IF EXISTS videos;")
		cur.close()
		cur = mysql.connection.cursor()

		cur.execute("DROP TABLE IF EXISTS descriptions;")
		cur.close()
		cur = mysql.connection.cursor()

		#sounds has to be dropped last because of foreign key constraints
		cur.execute("DROP TABLE IF EXISTS sounds;")
		cur.close()
		cur = mysql.connection.cursor()

		cur.execute("""

			create TABLE sounds(

			sound_id  int NOT NULL,
			track_volume varchar(16),
			track_number varchar(16),
			track_identifier varchar(32),
			track_name varchar(32),
			sound_path varchar(128) NOT NULL,
			valley_type int,
			audio_type varchar (32),

			placemark_name varchar(64),
			timed_track varchar(8),
			if_yes_when varchar(32),
			one_line_desc varchar(256),
			PRIMARY KEY(sound_id)


			);""")

		cur.close()
		cur = mysql.connection.cursor()

		cur.execute("""
			create TABLE pictures(

			pic_id int NOT NULL,
			pic_path varchar(128) NOT NULL,
			image_desc varchar(128) ,
			PRIMARY KEY(pic_id)


			);

			create TABLE picture_track_id(

			sound_id int,
			pic_id int,
			FOREIGN KEY(sound_id) REFERENCES sounds(sound_id),
			FOREIGN KEY(pic_id) REFERENCES pictures(pic_id)


			);



			create TABLE videos(

			vid_id int NOT NULL AUTO_INCREMENT,
			vid_path varchar(64) NOT NULL,
			sound_id int,
			PRIMARY KEY (vid_id),
			FOREIGN KEY(sound_id) REFERENCES sounds(sound_id)


			);
			create TABLE descriptions(

			desc_id int NOT NULL AUTO_INCREMENT,
			general_desc longtext,
			inst_desc_path varchar(128),
			musician_desc_path varchar(128),
			lyrics_original varchar(128),
			lyrics_translit varchar(128),
			lyrics_translation varchar(128),
			one_line_desc varchar(128) NOT NULL,
			sound_id int,
			PRIMARY KEY(desc_id),
			FOREIGN KEY(sound_id) REFERENCES sounds(sound_id)

			);

			ALTER TABLE descriptions MODIFY COLUMN general_desc VARCHAR(255)
	    	CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;

			""")
		cur.close()

			#read from the csv file (garden-metadata) to populate the db.

		toBeInserted = []
		all_descriptions =[]

		#each element is a key value pair
		#key is the path to the .txt file
		#value is the valley number
		#like this {'somepath.com/more/path.txt' : 2 }
		text_files = []

		#two title rows in .csv file
		title_line_counter = 0
		with open('var/sites/flask/flaskApp/Garden-metadata.csv', 'rb') as csvfile:
			dialect = csv.Sniffer().sniff(csvfile.read(1024))
			csvfile.seek(0)
			reader = csv.reader(csvfile, dialect)
			#reader = csv.reader(csvfile, delimiter=',', quotechar='|')
			for row in reader:
				if title_line_counter < 2:
					title_line_counter+=1
					continue
				newEntry = []
				track_descs = []
				#trackName
				if (row[0]):

					#print( "number of columns: %d", len(row),file=sys.stderr)
					#TODO
					#we got different numbers here
					#fix them
					#also add a thing to separate the .txt files from it for descriptions

					#ID
					newEntry.append(row[0])
					#track_volume
					newEntry.append(row[1])
					#track_number
					newEntry.append(row[2])
					#track_identifier
					newEntry.append(row[3])
					#track_name
					newEntry.append(row[4])
					#track_path
					newEntry.append(row[5])
					#valley_number
					newEntry.append(row[6].replace(" ", ""))
					#audio_type
					newEntry.append(row[7])
					#placemark_name
					newEntry.append(row[18])
					#timed_track
					newEntry.append(row[21])
					#if_yes_when
					newEntry.append(row[22])
					#one_line_desc
					newEntry.append(row[23])

					toBeInserted.append(newEntry)

					#track id is needed to make sure the descriptions match the tracks...
					#track ID
					track_descs.append(row[0])
					#general_Desc_path
					track_descs.append(row[11])
					#instrument_desc
					track_descs.append(row[12])
					#musician_desc
					track_descs.append(row[13])
					#lyrics_original
					track_descs.append(row[14])
					#lyrics_translit
					track_descs.append(row[15])
					#lyric_translation
					track_descs.append(row[16])
					#one_line_desc
					track_descs.append(row[23])

					all_descriptions.append(track_descs)

					#print("some row was not filled properly with data" , file=sys.stderr)
					#print (toBeInserted , file=sys.stderr)
		#print (toBeInserted , file=sys.stderr)

		for entry in toBeInserted:
			#print(entry , file=sys.stderr)

			cur = mysql.connection.cursor()
			#print (cur , file=sys.stderr)
			cur.execute("""

				INSERT INTO sounds(sound_id, track_volume, track_number, track_identifier, track_name, sound_path, valley_type , audio_type, placemark_name, timed_track, if_yes_when, one_line_desc)

				VALUES( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);





				""", (int(entry[0]), entry[1], entry[2], entry[3], entry[4], entry[5], entry[6], entry[7], entry[8], entry[9], entry[10] , entry[11]) )

			mysql.connection.commit()
			cur.close()



		# actualDescription = ""
		# for descs in all_descriptions:
		# 	#print(descs[2], file=sys.stderr)
		# 	#print('\n \n' , file=sys.stderr)
		# 	if descs[1]:
		# 		path_to_desc = descs[1].split("/")[4:]
		# 		string_to_desc = "var/sites/flask/flaskApp/ebg/" + "/".join(path_to_desc).replace(' ', "")
		# 		#print(string_to_desc + "\n")
		#
		# 		with open(string_to_desc,'r') as generalDesc:
		#
		# 			for line in generalDesc:
		# 				actualDescription +=line
		#
		# 			#print (actualDescription)
		# 			#print("")
		#
		# 			cur = mysql.connection.cursor()
		#
		#
		# 			cur.execute("""
		#
		#
		# 				INSERT INTO descriptions(general_desc, inst_desc_path, musician_desc_path, lyrics_original, lyrics_translit, lyrics_translation, one_line_desc, sound_id )
		#
		# 				VALUES(%s, %s, %s, %s, %s, %s, %s, %s);
		#
		#
		# 				""", (actualDescription, descs[2], descs[3], descs[4], descs[5], descs[6], descs[7], descs[0],))
		#
		# 			mysql.connection.commit()
		# 			cur.close()

		with open('var/sites/flask/flaskApp/Garden-metadata-Images.csv', 'rb') as file:

			dialect = csv.Sniffer().sniff(file.read(1024))
			file.seek(0)
			reader = csv.reader(file, dialect)

			#in the csv file there is a row to describe the columns
			title_line_counter = 0


			cur = mysql.connection.cursor()

			for row in reader:

				if title_line_counter < 1:
					title_line_counter+=1
					continue

				#pic_id = row[0]

				#pic_path = row[1]

				#image_desc = row[2]


				cur = mysql.connection.cursor()

				cur.execute("""


					INSERT INTO pictures(pic_id, pic_path, image_desc)

					VALUES(%s, %s, %s);

					""", (row[0] , row[1] , row[2]))

				mysql.connection.commit()
				cur.close()
		with open('var/sites/flask/flaskApp/Garden-metadata-track-image.csv', 'rb') as imagefile:

				dialect = csv.Sniffer().sniff(imagefile.read(1024))
				imagefile.seek(0)
				reader = csv.reader(imagefile, dialect)

				#in the csv file there is a row to describe the columns
				title_line_counter = 0


				cur = mysql.connection.cursor()

				for row in reader:

					if title_line_counter < 1:
						title_line_counter+=1
						continue

					#sound_id = row[0]

					#pic_id = row[1]

					cur = mysql.connection.cursor()

					cur.execute("""


						INSERT INTO picture_track_id(sound_id, pic_id)

						VALUES(%s, %s);

						""", (row[0] , row[1]))

					mysql.connection.commit()
					cur.close()



if __name__ == "__main__":

	app.run(ssl_context=context)
