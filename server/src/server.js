import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 5000;



const startServer = async () => {


try{


const { default: app } =
await import("./app.js");



const { default: connectDB } =
await import("./config/db.js");




// Database

await connectDB();





// Referral Route

const { default: referralRoutes } =
await import("./routes/referralRoutes.js");



app.use(
"/api/referral",
referralRoutes
);






app.listen(PORT,()=>{


console.log(
`🚀 Server running on http://localhost:${PORT}`
);


});




}catch(error){


console.error(

"Server startup failed:",

error.message

);



process.exit(1);


}


};





startServer();