const express = require('express');
const cors = require('cors');
const isReachable = require("is-reachable");

const args = process.argv;
const settings = args.length === 2 ? require("./services.example.json"): require(args[2]);
console.log(settings);

const app = express();
const port = settings.port;
app.use(express.static('assets'), cors({ origin: '*' }));

app.get('/api', (request, response) => {
   if (request.query.apiKey === settings.apiKey) {
      response.json({
         message: "usable commands: services, services/name"
      });
   }
   else {
      response.json({
         message: "invalid api key"
      });
   }
});

app.get('/api/services', (request, response) => {
   if (request.query.apiKey === settings.apiKey) {
      let ping_promises = [];
      let status_output = [];
      settings.services.forEach((service) => {
         ping_promises.push(
             new Promise(async (resolve) => {
                let online = await isReachable(service.address);
                status_output.push({
                   name: service.name,
                   address: service.address,
                   icon: service.icon,
                   online: online
                });
                resolve();
             }));
      });
      Promise.all(ping_promises).then(() => {
         response.json(status_output);
      });
   }
   else {
      response.json({
         message: "invalid api key"
      });
   }
});



var server = app.listen(port, function() {
   console.log("Ping service running on port " + port);
})