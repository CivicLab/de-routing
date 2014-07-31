define([], function(){

	// this scheme describes the json scheme of an exploration
	var explorationScheme = {
			
			firstPage : {

				type: 'object',
				title: ' ',
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
					area: {
						type : 'object',
						properties: {
							longitude: {
								type: 'number',
								description: '(decimal number)',
								minimum: 0.001
							},
							latitude: {
								type: 'number',
								description: '(decimal number)',
								minimum: 0.001
							},
							radius: {
								type: 'number',
								description: 'Expected radius from the start point (in m)',
								minimum: 1,
							default: 1000
							}
						}
					},
				},
				
				secondPage : {
					directions: {
						type: 'array',
						title: 'Directions',
						minItems: 1,
						items: {
							type : 'object',
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
					}, 
				},
				
				thirdPage: {

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
								default: 'Task'
								},
								subtasks : {
									type: 'array',
									title: 'Subtasks',
									minItems: 1,
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
												description: 'Length of a vieo or audio recording in seconds',
											default: 10

											},
											start: {
												type: 'string',
												description: 'Left text label of the slider'
											},
											end: {
												type: 'string',
												description: 'Right text label of the slider'
											}
										}
									} // end of subtask
								} 
							} // end of task
						}
					} // end of tasklist
				}

			}
	};

	return explorationScheme;

});