sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/listreportcustom/test/integration/FirstJourney',
		'com/listreportcustom/test/integration/pages/SalesDataList',
		'com/listreportcustom/test/integration/pages/SalesDataObjectPage'
    ],
    function(JourneyRunner, opaJourney, SalesDataList, SalesDataObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/listreportcustom') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSalesDataList: SalesDataList,
					onTheSalesDataObjectPage: SalesDataObjectPage
                }
            },
            opaJourney.run
        );
    }
);