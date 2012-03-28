Ext.onReady(function() {

	var chart = null;
	var grid = null;
    var nameTextField = new Ext.form.TextField({
          border      : false,
 	      fieldLabel  : 'Name',
 	      name        : 'first',
 	      id          : 'id-name',
 	      emptyText   : 'Enter Name',
 	      anchor	  : '60%',
 	      allowBlank  :  false
 	 });


        var emailTextField = new Ext.form.TextField({
     	 	  border      : false,
 		   	  fieldLabel  : 'Email',
 	   		  vtype       : 'email',
 	   		  name        : 'email',
 	   		  id          : 'id-email',
 	     	  emptyText   : 'Enter Email id',
 	     	  anchor      : '60%',
 	     	  allowBlank  : false
 	    });


 	    var favBrowserCheckBoxGroup = new Ext.form.CheckboxGroup({
 	         xtype      : 'checkboxgroup',
 	         id 		: 'id-checkbox',
       		 itemCls    : 'x-check-group-alt',
       		 columns    : 4,
       		 bodyStyle  : 'padding-left:100px;',
       		 items: [
               {boxLabel: 'Internet Explorer', name: '1'},
               {boxLabel: 'Firefox', name: '2'},
               {boxLabel: 'Safari', name: '3'},
               {boxLabel: 'Chrome', name: '4'},
               {boxLabel: 'Opera', name: '5'},
               {boxLabel: 'Konqueror', name: '6'},
               {boxLabel: 'Lynx', name: '7'}
             ],
        });

		function getNewLabel(text) {
			return {
				xtype : 'box',
				autoEl : {
					cn : text
				}
			};
		}

		var commentTextArea = new Ext.form.TextArea({
		         id   :'id-textarea',
		         anchor : '60%',
		         fieldLabel : 'Reason: ',
		         height : 120,
		         allowBlank  : false
        });
		
		var form = new Ext.FormPanel({
		 	     labelWidth : 75, 
		 	     frame      : true,
		 	     title      : 'Survey',
		 	     bodyStyle  : 'padding:5px 5px 0',
		 	     style		: 'margin:50;margin-top:50;',
		 	     width      : 550,
		 	     items: [
		 	     			nameTextField, emailTextField, getNewLabel('Choose your favorite browser(s)</font><font size="2">'), favBrowserCheckBoxGroup, commentTextArea
		 	            ],
		 	 
		 	     buttons: [{
		 	         text    : 'Confirm',
		 	         id 	 : 'confirm-button',
		 	         handler : saveChoice
		 	     }, {
		 	     	text    : 'View Results',
		 	        handler : showResults
		 	     }]
		 	 });

		/**
		 * Function to save results in DB
		 */
		function saveChoice(btn) {
			if (!nameTextField.validate()) {
				Ext.MessageBox.show({
						title : 'Warning!',
						msg : 'Please specify your Name',
						width : 75,
						buttons : Ext.MessageBox.OK
					});
				return;
			}

			if (!emailTextField.validate()) {
				Ext.MessageBox.show({
						title : 'Warning!',
						msg : 'Please enter valid email-id',
						width : 175,
						buttons : Ext.MessageBox.OK
				});
				
				return;
			}

			if (!commentTextArea.validate()) {
				Ext.MessageBox.show({
						title : 'Warning!',
						msg : 'Please specify your reason',
						width : 175,
						buttons : Ext.MessageBox.OK
				});
				
				return;
			}

			var selectedBrws = new Array();
			selectedBrws = favBrowserCheckBoxGroup.getChecked();
			var checkedBrws = new Array(7);
			for (j = 0; j < 7; ++j) {
				checkedBrws[j] = 0;
			}
			for (i = 0; i < selectedBrws.length; ++ i) {
				if (selectedBrws[i].getName() != null) {
					checkedBrws[parseInt(selectedBrws[i].getName())-1] = 1;
				} 
			}

			if (selectedBrws.length == 0) {
				Ext.MessageBox.show({
						title : 'Warning!',
						msg : 'Please select atleast one browser',
						width : 200,
						buttons : Ext.MessageBox.OK
					});
				return;
			}

			Ext.Ajax.request({
				url : 'insertSurveyDetiails.php',
				method : 'POST',
				params : {
					name : nameTextField.getValue(), // TimeFrameIndex is the selected option of the TimeFrameaList
					email : emailTextField.getValue(), // NotificationIndex is the selected option of the NotificationList
					IE : checkedBrws[0],
					firefox : checkedBrws[1],
					safari : checkedBrws[2],
					chrome : checkedBrws[3],
					opera : checkedBrws[4],
					konquer : checkedBrws[5],
					lynx : checkedBrws[6],
					reason : commentTextArea.getValue(),
					confirm : 1
				},
				scope : this
			});

			Ext.MessageBox.show({
						title : 'Confirmation!',
						msg : 'Thank you for participating in the Survey.',
						width : 300,
						buttons : Ext.MessageBox.OK,
						animateTarget : 'confirm-button'
					});
			// Update results
			showResults();
		}

		var data;

		function showResults(btn) {
			Ext.Ajax.request({
				url : 'surveyResults.php',
				success : function(response) {
					var data;
					if (response.responseText == "[]") {
						Ext.MessageBox.show({
							title : 'Warning!',
							msg : 'You are first person to participate in the Survey.',
							width : 300,
							buttons : Ext.MessageBox.OK
						});
					    return;
					}
					try { 
					   data = Ext.JSON.decode(response.responseText);
					} catch(e) {
					   Ext.MessageBox.show({
							title : 'Warning!',
							msg : 'You are first person to participate in the Survey.',
							width : 300,
							buttons : Ext.MessageBox.OK
						});
					    return;
					}
					
   					if (chart == null || chart == undefined) {
   						var store = Ext.create('Ext.data.JsonStore', {
	    					 fields: ['name', 'choice'],
	   						 data: data
						});
						chart = new Ext.chart.Chart({
					        width: 600,
					        height: 400,
					        animate: true,
					        store: store,
					        renderTo: 'survey-result',
					        shadow: true,
					        legend: {
					            position: 'right'
					        },
					        insetPadding: 25,
					        theme: 'Base:gradients',
					        series: [{
					            type: 'pie',
					            field: 'choice',
					            showInLegend: true,
					            tips: {
								  trackMouse: true,
								  width: 140,
								  height: 28,
								  renderer: function(storeItem, item) {
								    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('choice'));
								  }
								},
					            highlight: {
					              segment: {
					                margin: 20
					              }
					            },
					            label: {
					                field: 'name',
					                display: 'rotate',
					                contrast: true,
					                font: '18px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
					            },
					            animate: true
					        }]
						});	
   					} else {
   						chart.store.loadData(data);
   					}
   				
	   				Ext.Ajax.request({
						url : 'showGridResult.php',
						success : function(response) {
							
							if (response.responseText == "[]") {
								Ext.MessageBox.show({
									title : 'Warning!',
									msg : 'You are first person to participate in the Survey.',
									width : 300,
									buttons : Ext.MessageBox.OK
								});
							    return;
							}
							
							try { 
							   data = Ext.JSON.decode(response.responseText);
							} catch(e) {
							   Ext.MessageBox.show({
									title : 'Warning!',
									msg : 'You are first person to participate in the Survey.',
									width : 300,
									buttons : Ext.MessageBox.OK
								});
							    return;
							}
							if (grid == null || grid == undefined) {
								// create the data store
							    var store1 = Ext.create('Ext.data.JsonStore', {
			    					 fields: ['name', 'email', 'browsers', 'reason', 'time'],
			   						 data: data
								});

							    // create the Grid
							    grid = Ext.create('Ext.grid.Panel', {
							        store: store1,
							        stateful: true,
							        stateId: 'stateGrid',
							        columns: [
							            {
							                text     : 'Name',
							                flex     : 1,
							                sortable : false,
							                dataIndex: 'name'
							            },
							            {
							                text     : 'Email',
							                width    : 75,
							                sortable : true,
							                dataIndex: 'email'
							            },
							            {
							                text     : 'Browsers',
							                flex     : 1,
							                dataIndex: 'browsers'
							            },
							            {
							                text     : 'Reason',
							                flex     : 1,
							                dataIndex: 'reason'
							            },
							            {
							                text     : 'Date/Time',
							                flex     : 1,
							                dataIndex: 'time'
							            }
							        ],
							        height: 350,
							        width: 600,
							        title: 'Survey Results',
							        renderTo: 'survey-result',
							        viewConfig: {
							            stripeRows: true
							        }
							    });
							} else {
								grid.store.loadData(data);
							}

						}
					});
				}
			});

		}	
 	  	form.render('survey-browser');

});
