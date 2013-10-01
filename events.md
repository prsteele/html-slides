Events
======

We use an event framework to control the behavior of the slide
show. Below are the events we use.

*   `previous`

	This event is called to indicate that the slide show should move
	backward; emits `previous_stage` if the current slide has any
	stages that can be undone, and emits `previous_slide` otherwise.
	
*   `previous_slide`

	This event is called to move the current slide backward by one.
	
*   `previous_stage`

	This event is called to move the current stage backward by one.
	
*   `next`

	This event is called to indicate that the slide show should move
	forwards; emits `next_stage` if the current slide has any
	stages that can be executed, and emits `next_slide` otherwise.
	
*   `next_slide`

	This event is called to move the current slide forward by one.
	
*   `next_stage`

	This event is called to move the current stage forward by one.
	
*   `update`

	This event is called to update the display of the current slide;
	thus, any changes to the current slide or current stage triggered
	by other events are displayed once this event is called.
