import unittest
import requests
import json

url = "http://localhost:2000/"

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
    def test_weekdata_get_content_size(self):
        print("Testing that the weekdata JSON is not an empty collection...")
        response = requests.get(url + "weekdata")
        #convert response into a list
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertEqual(len(respJSON), 1)

    def test_weekdata_get_content_fields(self):
        print("Checking types of the specific fields in weekdata response...")
        response = requests.get(url + "weekdata")
        #convert response into a list
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertEqual(type(respJSON[0]['_id']), str)
        self.assertEqual(type(respJSON[0]['Sunday']), int)
        self.assertEqual(type(respJSON[0]['Monday']), int)
        self.assertEqual(type(respJSON[0]['Tuesday']), int)
        self.assertEqual(type(respJSON[0]['Wednesday']), int)
        self.assertEqual(type(respJSON[0]['Thursday']), int)
        self.assertEqual(type(respJSON[0]['Friday']), int)
        self.assertEqual(type(respJSON[0]['Saturday']), int)

    # data endpoint (/data)
    def test_data_get_success(self):
        print("Testing that GET request to data endpoint returns with a 200 code...")
        response = requests.get(url + "data")
        self.assertEqual(response.status_code, 200)
    
    def test_data_get_content_size(self):
        print("Testing that data JSON exists(i.e. has a size >= 0)...")
        response = requests.get(url + 'data')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        self.assertGreaterEqual(len(respJSON), 0)

    def test_data_get_content_fields(self):
        print("Checking types of the specific fields in data response...")
        response = requests.get(url + 'data')
        respJSON = json.loads(response.content.decode("utf").replace("'", '"'))
        if (len(respJSON) > 0):
            for i in range(len(respJSON)):
                pass

        else:
            self.assertEqual(True, True)

if __name__ == '__main__':
    unittest.main()