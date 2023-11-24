from flask import Flask  # Import flask

from flask import send_file, redirect, request
from flask import jsonify

from flask_vite import Vite
from flask_cors import CORS
import base64
import opencvScript


app = Flask(__name__)
#app = Flask(__name__, static_url_path='')  # Setup the flask app by creating an instance of Flask
#vite = Vite(app)
CORS(app)


@app.route('/')  # When someone goes to / on the server, execute the following function
def home():
    return redirect("/getImg") #"boy " #app.send_static_file('index.html')  # Return this message back to the browser

@app.route('/getImg')
def getImg():
    opencvScript.chainScript()
    resp = send_file("facebox.png", mimetype='image/gif')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers["Access-Control-Allow-Methods"] ="DELETE, POST, GET, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"

    return resp

@app.route('/sendImg', methods = ['POST'])
def sendImg():
    
    payload = request.json
    #print(payload)
    if request.method == 'OPTIONS':
        print(payload)
    image = payload['content']
    # before ',' symbol there will be like 'data:image/png;base64', so you can understand image file
    image = image[image.find(",") + 1:]  # get the image data from input
    file_content = base64.b64decode(image)
    with open("liveimage.jpg", "wb") as fh:
        fh.write(file_content)
    return jsonify("success"), 200 



if __name__ == '__main__':  # If the script that was run is this script (we have not been imported)
    app.run()  # Start the server
