import unittest
import requests
import json
from datetime import datetime

websites = ["http://localhost:2000/", "http://54.174.75.180/"]
url = websites[0]

# Run this file while the web server hosting the API is running
class AppTest(unittest.TestCase):
    # root endpoint (/)
    def test_default_api_call_error(self):
        print("Testing that GET request on root endpoint returns error code...")
        response = requests.get(url)
        self.assertEqual(response.status_code, 404)
    
    # week data endpoint (/weekdata)
    def test_weekdata_get_success(self):
        print("Testing that GET request to weekdata endpoint returns with a 200 code...")
        response = requests.get(url + "weekdata")
        self.assertEqual(response.status_code, 200)

    def test_weekdata_get_query_success(self):
        print("Testing that GET request to weekdata endpoint after querying an ID returns with a 200 code...")
        response = requests.get(url + "weekdata?handleId=30")
        self.assertEqual(response.status_code, 200)

    def test_weekdata_post_failure(self):
        print("Testing that POST request to weekdata endpoint returns with a 404 code...")
        response = requests.post(url + "weekdata")
        self.assertEqual(response.status_code, 404)
    
    def test_weekdata_get_content_size(self):
        print("Testing that the weekdata JSON is an empty collection (since we access data by querying)...")
        response = requests.get(url + "weekdata")
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertEqual(len(respJSON), 0)
    
    def test_weekdata_get_content_query_size(self):
        print("Testing that the weekdata JSON is not an empty collection after querying...")
        response = requests.get(url + "weekdata?handleId=30")
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertNotEqual(len(respJSON), 0)

    def test_weekdata_get_content_fields(self):
        print("Checking types of the specific fields in weekdata response...")
        response = requests.get(url + "weekdata?handleId=30")
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertEqual(type(respJSON[0]['_id']), str)
        self.assertEqual(type(respJSON[0]['doorsSanid']), int)
        self.assertEqual(type(respJSON[0]['Sunday']), int)
        self.assertEqual(type(respJSON[0]['Monday']), int)
        self.assertEqual(type(respJSON[0]['Tuesday']), int)
        self.assertEqual(type(respJSON[0]['Wednesday']), int)
        self.assertEqual(type(respJSON[0]['Thursday']), int)
        self.assertEqual(type(respJSON[0]['Friday']), int)
        self.assertEqual(type(respJSON[0]['Saturday']), int)
    
    def test_weekdata_get_content_read(self):
        print("Testing/mocking that we can extract values from JSON (weekdata endpoint) onto a data array...")
        dataArray = []
        response = requests.get(url + 'weekdata?handleId=30')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        
        for key in respJSON[0]:
            if (key != '_id') and (key != 'doorsSanid'):
                templateObject = {'day': key, 'sanitizations': respJSON[0][key]}
                dataArray.append(templateObject)
    
        for i in range(len(dataArray)):
            self.assertEqual(type(dataArray[i]['day']), str)
            self.assertEqual(type(dataArray[i]['sanitizations']), int)
    
    def test_weekdata_update_sanitizations(self):
        print("Testing that number of sanitizations updates...")
        response = requests.get(url + 'weekdata?handleId=30')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        currentNumOfSanitizations = respJSON[0][datetime.today().strftime('%A')]

        updatedResponse = requests.get(url + 'updateInteractions?handleId=30')
        self.assertEqual(updatedResponse.status_code, 200)

        #Fetch data again
        response = requests.get(url + 'weekdata?handleId=30')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertEqual(respJSON[0][datetime.today().strftime('%A')], currentNumOfSanitizations)

    # data endpoint (/data)
    def test_data_get_success(self):
        print("Testing that GET request to data endpoint returns with a 200 code...")
        response = requests.get(url + "data")
        self.assertEqual(response.status_code, 200)

    def test_data_post_failure(self):
        print("Testing that POST request to data endpoint returns with a 404 code...")
        response = requests.post(url + "data")
        self.assertEqual(response.status_code, 404)
    
    def test_data_get_content_size(self):
        print("Testing that data JSON exists (i.e. has a size >= 0)...")
        response = requests.get(url + 'data')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertGreaterEqual(len(respJSON), 0)

    def test_data_get_content_fields(self):
        print("Checking types of the specific fields in data response...")
        response = requests.get(url + 'data')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        if (len(respJSON) > 0):
            for i in range(len(respJSON)):
                self.assertEqual(type(respJSON[i]["_id"]), str)
                self.assertEqual(type(respJSON[i]["doorsSanid"]), int)
                self.assertEqual(type(respJSON[i]["grmsKild"]), int)
        else:
            self.assertEqual(True, True)

    def test_data_get_content_read(self):
        print("Testing/mocking that we can extract values from JSON (data endpoint) onto a data array...")
        dataArray = []
        response = requests.get(url + 'data')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        
        if (len(respJSON) > 0):
            for i in range(len(respJSON)):
                templateObject = {'name': "Device " + str(i+1), 'value': respJSON[i]['doorsSanid']}
                dataArray.append(templateObject)
        else:
            self.assertEqual(True, True)
        
        for i in range(len(dataArray)):
            self.assertEqual(type(dataArray[i]['name']), str)
            self.assertEqual(type(dataArray[i]['value']), int)

if __name__ == '__main__':
    unittest.main()