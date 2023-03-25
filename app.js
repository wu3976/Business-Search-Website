const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { query } = require("express");

const YELP_API_KEY = "KlvkVTe0Hjv7aCPomitjhk79VmmwLh03nQV_5Trr4qkh8tbZEv2Fmo7KhsCoSifoEd5GdmPqvUC2Xmj8iTO3xSzTpqFUmMgJZrp7HBdmm00q4vo-sAcx0Wotw9g4Y3Yx";
app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(process.cwd() + "/frontend/dist/frontend/"))

app.get("/autocomplete", (req, res) => {
    let text_to_complete = req.query["text"];
    axios.get("https://api.yelp.com/v3/autocomplete", { 
        "params": { "text": text_to_complete},
        "headers": {
            "Authorization": "Bearer " + YELP_API_KEY
        }
    }).then(function(yelp_response) {
        //console.log(yelp_response["data"]);
        res.json(yelp_response["data"]);
    })
})

app.get("/business_search", (req, res) => {
    //console.log(req.query);
    let queryp = req.query;
    queryp["limit"] = "10";
    axios.get("https://api.yelp.com/v3/businesses/search",{
        "params": queryp,
        "headers": {
            "Authorization": "Bearer " + YELP_API_KEY
        }
    }).then(function(yelp_response) {
        let data = yelp_response["data"];
        let refined_json = {
            "business_list" : []
        }
        for (let business of data["businesses"]) {
            refined_json["business_list"].push(
                {
                    "id": business["id"],
                    "name": business["name"],
                    "image_url": business["image_url"],
                    "rating": business["rating"],
                    "distance": business["distance"]
                }
            )
        }
        res.json(refined_json);
    })
})

app.get("/business_detail", (req, res) => {
    let id = req.query["id"];
    axios.get("https://api.yelp.com/v3/businesses/" + id, {
        "headers": {
            "Authorization": "Bearer " + YELP_API_KEY
        }
    }).then(
        (yelp_response) => {
            //console.log(yelp_response.data);
            let data = yelp_response.data;
            let refined_json = {
                "categories": [],
                "coordinates": data["coordinates"],
                "phone": data["display_phone"],
                "is_open_now": typeof(data["hours"]) !== "undefined" 
                && data["hours"].length > 0 ? data["hours"][0]["is_open_now"] : null,
                "location": data["location"], // a dict of infos
                "id": data["id"],
                "name": data["name"],
                "photos": data["photos"], // list of url
                "price": data["price"],
                "url": data["url"]
            }
            for (let catobj of data["categories"]) {
                refined_json["categories"].push(catobj["title"]);
            }
            console.log(refined_json);
            res.json(refined_json);
        }
    );
})

app.get("/review", (req, res) => {
    let id = req.query["id"];
    axios.get("https://api.yelp.com/v3/businesses/" + id + "/reviews", {
        "headers": {
            "Authorization": "Bearer " + YELP_API_KEY
        }
    }).then(
        (yelp_response) => {
            let refined_json = {
                "review": []
            }
            let counter = 0;
            for (let r of yelp_response.data["reviews"]) {
                refined_json["review"].push(
                    {
                        "rating": r["rating"],
                        "username": r["user"]["name"],
                        "text": r["text"],
                        "time_created": r["time_created"].split(" ")[0]
                    }
                )
                counter++;
                if (counter === 3) {
                    break;
                }
            }
            console.log(refined_json);
            res.json(refined_json);
        }
    )
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + "/frontend/dist/frontend/index.html");
})

app.get('/search', (req, res) => {
    res.sendFile(process.cwd() + "/frontend/dist/frontend/index.html");
})

app.get("/bookings", (req, res) => {
    res.sendFile(process.cwd() + "/frontend/dist/frontend/index.html");
})

app.listen(3000, (req, res) => {
    console.log("backend server started at port 3000");
});

