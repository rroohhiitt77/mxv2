module.exports = {

	//url : 'mongodb://<user>:<pass>@mongo.onmodulus.net:27017/uw45mypu',

    // ========== PRODUCTION ==========================================================================================

    //Main prod db for doctor
    dbprod_medixprt_doctor : 'mongodb://mxdoc:mxdoc112233@ds059145.mlab.com:59145/mxdoctor',
    // Firebase
    firebaseProdUrl : 'https://blistering-torch-8744.firebaseio.com/slotsProd',
    firebaseQProdUrl : 'https://blistering-torch-8744.firebaseio.com/QProd',
    firebaseChatProdUrl : 'https://mxchat-d5b5c.firebaseio.com/chatProd',
    //Patient DB
    dbprod_medixprt_patient : 'mongodb://rohit:test1@ds029640.mongolab.com:29640/medixprt',

    //Static
    dbprod_medixprt_static  : 'mongodb://admin:admin123@ds017553.mlab.com:17553/medixprt_static',
    //Others
    dbprod_medixprt_medicines : 'mongodb://dev:dev1-@ds047095.mongolab.com:47095/medicines',

    // ================================================================================================================

    // ========== LOCAL ========================================================================================
    //Main db for doctors
    dblocal_medxiprt_doctor : 'mongodb://localhost/mxdoctor',
    //Patient DB
    dblocal_medxiprt_patient : 'mongodb://localhost/medixprt',
	//Static db urls
    dblocal_medxiprt_static : 'mongodb://localhost/medixprtStatic',
    //Firebase
    firebaseDevUrl : 'https://blistering-torch-8744.firebaseio.com/slotsDev',
    firebaseQDevUrl : 'https://blistering-torch-8744.firebaseio.com/QDev',
    firebaseChatDevUrl : 'https://mxchat-d5b5c.firebaseio.com/chatDev',
    //================================================================================================================
}