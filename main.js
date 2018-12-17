function main() {
    var accountBudgetLimit = LIMIT_NUMBER_HERE;         // set your account budget limit here
  	var email = 'YOUR_EMAIL_HERE' 					    // who to send the notifications to
    var camp_name_contains = 'CAMPAIGN_NAME_HERE'	    // to filter campaigns containing this string
    var camp_name_in_email = 'CAMPAIGN_REFERENCE_HERE'	// the reference to the campaigns in the e-mail sent
    var date_range = 'THIS_MONTH'						// date range to check for the spend
  
// DO NOT MODIFY FROM THIS PART ONWARDS!!!
// ISSUE - SMART DISPLAY CAMPAIGNS CAN'T BE PAUSED!
    
    var accountCampaignsCost = 0;  	// don't modify, just initializing the variable to loop over it
  
  
  	var report = AdsApp.report("SELECT Cost FROM CAMPAIGN_PERFORMANCE_REPORT WHERE CampaignName CONTAINS_IGNORE_CASE '"+ camp_name_contains +"' DURING " + date_range)
    var report_iterator = report.rows()

  	/*
     * This While-loop sums the costs garnered by all 
     * the campaigns of the account for the specified date range
     */
  	while (report_iterator.hasNext()){
      var report_row = report_iterator.next()
      var cost = parseFloat(report_row["Cost"].replace(/[^\d\.]/g,''))
      accountCampaignsCost += cost
    }

     if (accountCampaignsCost >= accountBudgetLimit) { // If the total costs of the campaign has reached or exceeded the specified limit, pause the campaigns
        Logger.log("Budget has exceeded the limit!");
        var campaigns = AdsApp.campaigns().withCondition("Name CONTAINS_IGNORE_CASE '" + camp_name_contains + "' AND Status = ENABLED").get(); // gets all the campaigns of the account.
        while (campaigns.hasNext()) {
            var campaign = campaigns.next();
            Logger.log("Pausing campaign " + campaign.getName() + "...");
            campaign.pause(); // pauses the campaign
        }
    
       MailApp.sendEmail(email,
            'IMPORTANT! ' + camp_name_in_email + ' campaigns over budget limit!',
            'The total cost of your ' + camp_name_in_email + ' campaigns has reached or exceeded the specified limit - €'+ accountBudgetLimit + '. IMPORTANT - if you have smart display campaigns, they have to be paused manually!! The other campaigns are now paused. The current spending is: €' + accountCampaignsCost); // notifies you with an email when total cost of the campaigns has reached 100% of the specified limit. You may change the email message based on your preference.
      
    } else if (accountCampaignsCost >= (accountBudgetLimit * 0.9)) { // Checks if the total cost of the campaigns has reached 90% of the specified limit

        MailApp.sendEmail(email,
            'WARNING! ' + camp_name_in_email + ' campaigns over 90% spend!',
            'The total cost of your ' + camp_name_in_email + ' campaigns has reached or exceeded 90% of the specified limit - €'+ accountBudgetLimit + '. The current spending is: €' + accountCampaignsCost); // notifies you with an email when total cost of the campaigns has reached 90% of the specified limit. You may change the email message based on your preference.

    } else if (accountCampaignsCost >= (accountBudgetLimit * 0.5)) { // Checks if the total cost of the campaigns has reached 50% of the specified limit

        MailApp.sendEmail(email,
            camp_name_in_email + ' campaigns over 50% spend!',
            'The total cost of your ' + camp_name_in_email + ' campaigns has reached or exceeded 50% of the specified limit - €'+ accountBudgetLimit + '. The current spending is: €' + accountCampaignsCost); // notifies you with an email when total cost of the campaigns has reached 50% of the specified limit. You may change the email message based on your preference.

    } else {
        Logger.log("Total spending of campaigns has not yet reached the account budget limit. The current spending is: €" + accountCampaignsCost);
    }
}
