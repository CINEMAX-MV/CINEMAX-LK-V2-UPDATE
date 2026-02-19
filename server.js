
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve your index.html from 'public' folder

app.post("/verify", async (req, res) => {
    const token = req.body["g-recaptcha-response"];
    const secretKey = "6Lcv8nAsAAAAALdxtnJyjaw8NwA5acZ9290_M1tN";

    try {
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, { method: "POST" });
        const data = await response.json();
        if(data.success) res.json({success:true});
        else res.json({success:false});
    } catch(err){
        res.json({success:false});
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
