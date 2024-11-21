sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
], function (MessageToast, Fragment) {
    'use strict';
    var that = this;
    return {
        // oncreate: function(oEvent) {
        //     MessageToast.show("Custom handler invoked.");

        // },
        onDownload: function () {
            //var oModel = this.getModel(); // Ensure this model is properly defined in the manifest.json
            //oModel.bindContext("/SalesData(vbeln='100',IsActiveEntity=true)/com.sap.gateway.srvd.zsd_so_data.v0001.funDownload(...)").invoke();
            var oModel = this.getModel();

            // Prepare the data for the request
            var sServiceUrl = oModel.sServiceUrl; // Base service URL

            // Define the entity and function paths
            var sEntityPath = "SalesData(vbeln='100',IsActiveEntity=true)";
            var sFunctionPath = sServiceUrl + "/" + sEntityPath + "/com.sap.gateway.srvd.zsd_so_data.v0001.actDownload";

            // Step 1: Retrieve CSRF token via a GET request
            $.ajax({
                url: sServiceUrl + "/SalesData(vbeln='100',IsActiveEntity=true)", // Use any entity to fetch CSRF token
                type: "GET",
                success: function (data, status, xhr) {
                    var csrfToken = oModel.getHttpHeaders()["X-CSRF-Token"]; // Retrieve the CSRF token

                    // Step 2: Make the POST request to call the action function with the CSRF token
                    $.ajax({
                        url: sFunctionPath, // Add necessary query parameters
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": csrfToken, // Include the CSRF token
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "If-Match": data["@odata.etag"]
                        },
                        success: function (data) {
                            MessageToast.show("Download function executed successfully!");
                            console.log("Download function result:", data);

                            // Assuming 'data.template' contains the Base64-encoded content
                            let base64Content = data.template; // Replace with your variable holding the template data

                            // Step 1: Clean the Base64 string
                            // Remove any non-Base64 characters like newlines or extra spaces
                            base64Content = base64Content.replace(/\s+/g, '');

                            // If it's URL-safe Base64, replace URL-specific characters
                            base64Content = base64Content.replace(/-/g, '+').replace(/_/g, '/');

                            // Step 2: Decode the Base64 string to binary data
                            try {
                                const binaryContent = atob(base64Content);

                                // Step 3: Convert binary data to a Uint8Array
                                const binaryLength = binaryContent.length;
                                const bytes = new Uint8Array(binaryLength);

                                for (let i = 0; i < binaryLength; i++) {
                                    bytes[i] = binaryContent.charCodeAt(i);
                                }

                                // Step 4: Create a Blob and trigger the download
                                const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

                                const downloadLink = document.createElement("a");
                                downloadLink.href = window.URL.createObjectURL(blob);
                                downloadLink.download = "SalesData.xlsx"; // Provide a default filename
                                downloadLink.click();

                                // Revoke the URL after download
                                window.URL.revokeObjectURL(downloadLink.href);

                            } catch (error) {
                                console.error("Failed to decode Base64 string:", error);
                                alert("The data could not be processed. Please verify the source.");
                            }

                        },
                        error: function (error) {
                            MessageToast.show("Failed to execute download function.");
                            console.error("Error executing Download function:", error);
                        }
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Failed to retrieve CSRF token:", error);
                }
            });





            // $.ajax({
            //     url: sServiceUrl + "/SalesData(vbeln='100',IsActiveEntity=true)/com.sap.gateway.srvd.zsd_so_data.v0001.actDownload?sap-client=100&$select=SAP__Messages",  // Make sure this is a simple entity
            //     type: "POST",
            //     headers: {
            //         "X-CSRF-Token": oModel.getHttpHeaders()["X-CSRF-Token"], // Include the CSRF token
            //         "Content-Type": "application/json",
            //         "Accept": "application/json"
            //     },
            //     success: function (data, status, xhr) {
            //         var csrfToken = xhr.getResponseHeader("X-CSRF-Token");
            //         console.log("CSRF Token:", csrfToken);
            //     },
            //     error: function (xhr, status, error) {
            //         console.error("Failed to retrieve CSRF token:", error);
            //     }
            // });


        }
    };
});
