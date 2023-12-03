module.exports = {
    ApiResponse (data, statuscode) {
        const apiresponse = {
            ResponseBody: data,
            StatusCode: statuscode,
            StatusMessage: "Successfull"
        }
        return apiresponse;
    }
}