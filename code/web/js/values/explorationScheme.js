define([], function(){

	// this scheme describes the json scheme of an exploration
	var explorationScheme = {

		firstPage : {

			type: 'object',
			title: 'Edit Data',
			properties: {
				name: {
					type: 'string',
					description: 'The title of the exploration',
					minLength: 1
				},
				description: {
					type: 'string',
					description: 'A small description of the exploration (only appears on the webpage)',
					minLength: 1
				},
				briefing: {
					type: 'string',
					description: 'Text appears at the start of the exploration',
					minLength: 1
				},
				randomTasks: {
					type: 'boolean',
					description: 'Should the tasks be asked in a randomized order?',
					'default' : true
				},
				area: {
					type : 'object',
					properties: {
						longitude: {
							type: 'number',
							description: '(decimal number xx.xxx... )',
							minimum: 0.001
						},
						latitude: {
							type: 'number',
							description: '(decimal number xx.xxx... )',
							minimum: 0.001
						},
						radius: {
							type: 'number',
							description: 'Expected radius from the start point (in m)',
							minimum: 1,
							'default': 1000
						}
					}
				},
			}
		},

		secondPage : {
			type: 'object',
			title: 'Edit Directions',
			properties: {
				directions: {
					type: 'array',
					title: 'Directions',
					minItems: 1,
					items: {
						type : 'object',
						title: 'Direction',
						properties: {
							text : {
								type: 'string',
								description: 'Text for the directional order'
							},
							type : {
								type : 'string',
								enum : ['left','right','forward','undirected'],
								description: 'Type of directional order'
							}
						}
					}
				}
			} 
		},

		thirdPage: {
			type: 'object',
			title: 'Edit Tasks',
			properties: {
				tasklist: {
					type : 'array',
					title: 'Tasks',
					minItems : 1,
					items: {
						type: 'object',
						title: 'Task',
						properties: {
							title: {
								type: 'string',
								'default': 'Task'
							},
							subtasks : {
								type: 'array',
								title: 'Subtasks',
								items: {
									type: 'object',
									id: 'arr_item',
									title: 'Subtask',
									properties: {
										text : {
											type: 'string',
											description: 'The text describes what the explorer has to do.'
										},
										action: {
											type: 'string',
											enum: ['none','picture','video','audio','slider','text'],
											description: 'How can the explorer answer or document the task?'

										},
										duration: {
											type: 'number',
											description: '(only for video/audio) Length of the video or audio recording in seconds',
											'default': 10

										},
										start: {
											type: 'string',
											description: '(required only for slider) Left text label of the slider'
										},
										end: {
											type: 'string',
											description: '(required only for slider) Right text label of the slider'
										}
									}
								} // end of subtask
							} 
						} // end of task
					}
				} // end of tasklist
			}
		} // end of third page
			
	}; // end of jsob object*/

	return explorationScheme;

});