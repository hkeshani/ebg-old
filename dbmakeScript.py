#!/usr/bin/python
from flask_mysqldb import MySQL, MySQLdb
import csv

def makeDB():
	#db = MySQLdb.connect(user="islamicgarden", passwd="5fa9E&xtfu" , db="islamicgarden")

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
		general_desc varchar(128),
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



	actualDescription = ""
	for descs in all_descriptions:
		#print(descs[2], file=sys.stderr)
		#print('\n \n' , file=sys.stderr)

				cur = mysql.connection.cursor()


				cur.execute("""


					INSERT INTO descriptions(general_desc_path, inst_desc_path, musician_desc_path, lyrics_original, lyrics_translit, lyrics_translation, one_line_desc, sound_id )

					VALUES(%s, %s, %s, %s, %s, %s, %s, %s);


					""", (descs[1], descs[2], descs[3], descs[4], descs[5], descs[6], descs[7], descs[0],))

				mysql.connection.commit()
				cur.close()

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

  makeDB()
