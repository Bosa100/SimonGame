$(document).ready(function() {
	var on = false,
		strict = false,
		$on = $("#on"),
		$off = $("#off"),
		$strict = $("#strict"),
		$start = $("#start"),
		$settingButtons = $("#start, #strict"),
		$colors = $("#green, #yellow, #red, #blue"),
		$num = $("#num"),
		$this,
		$triggered,
		$audio = $('audio'),
		triggeredColor,
		countdown,
		reps,
		sequence,
		colors = ["green", "red", "blue", "yellow"],
		count = 1,
		color,
		currentColor,
		machine = false,
		human = false,
		timeOuts = [],
		timeOut;
		
	// linked list constructor
	function Sequence() {
		// color constructor
		function Node(color) {
			this.color = color;
			this.next = null;
		}

		// private properties
		var newColor;
		var curr;

		// public properties
		this.first = null;

		this.addColor = function(color) {
			newColor = new Node(color);
			if (this.first) {
				curr = this.first;
				while (curr.next !== null) {
					curr = curr.next;
				}
				curr.next = newColor;
			} else {
				this.first = newColor;
			}
		};
	}
	// turns machine on and off
	$("#state").click(function() {
		$(".shine").toggleClass("shine");
		if (on) {
			$off.toggleClass("shine");
			on = false;
			machine = false;
			$num.text("");
			$settingButtons.css({ "pointer-events": "none" });
			if (strict) {
				strictOff();
			}
		} else {
			$on.toggleClass("shine");
			on = true;
			human = true;
			machine = false;
			color = null;
			$num.text("---");
			$settingButtons.css({ "pointer-events": "auto" });
		}
	});

	$strict.click(function() {
		if (on) {
			if (!strict) {
				strictOn();
			} else {
				strictOff();
			}
		}
	});

	$start.click(function() {
		if (on) startGame();
	});

	$colors.click(function() {
		if (on) {
			if (!machine && human) {
				triggerColor(this.id, 0, 200, true);
				if (this.id === currentColor.color) {
					if (currentColor.next !== null) {
						currentColor = currentColor.next;
					} else {
						machine = true;
						window.setTimeout(function() {
							addColor();
						}, 1200);
						count++;
						updateCount();
					}
				} else {
					machine = true;
					color = sequence.first;
					playErrorMessage();
					window.setTimeout(function() {
						if (!strict) {
							updateCount();
							if (count < 21) {
								playSequence();
							}
						} else {
							startGame();
						}
					}, 2300);
				}
			}
		}
	});

	function startGame() {
		machine = true;
		color = null;
		countDown();
	}

	function countDown() {
		$start.off("click");
		for (var i = 1; i <= 3; i++) {
			$num.fadeTo(250, 0);
			if (i === 1) {
				$num.text("---");
			}
			$num.fadeTo(250, 1);
		}

		window.setTimeout(function() {
			$start.click(function() {
				if (on) startGame();
			});
			if (machine) initializeSequence();
		}, 1500);
	}

	function strictOn() {
		strict = true;
		$strict.css("box-shadow", "0px 0px 75px 25px #FFFF00");
		window.setTimeout(function() {
			$strict.css({
				"background-color": "#FFFF00",
				transform: "translate(-3px,3px)"
			});
		}, 50);
	}

	function strictOff() {
		strict = false;
		$strict.css({
			"background-color": "yellow",
			"box-shadow": "-3px 3px",
			transform: ""
		});
	}

	function initializeSequence() {
		sequence = new Sequence();
		window.setTimeout(function() {
			if (machine) $num.text("01");
			count = 1;
			addColor();
		}, 1000);
	}

	function generateColor() {
		return colors[Math.floor(Math.random() * (3 - 0 + 1)) + 0];
	}

	function addColor() {
		sequence.addColor(generateColor());
		playSequence();
	}

	function triggerColor(id, t1, t2, clicked) {
		
		$triggered = $("#" + id);
		switch (id) {
			case "green":
				triggeredColor = "#39FF14";
				$audio[3].play();
				break;
			case "red":
				triggeredColor = "#FF0000";
				$audio[0].play();
				break;
			case "yellow":
				triggeredColor = "#FFFF00";
				$audio[2].play();
				break;
			default:
				triggeredColor = "blue";
				$audio[1].play();
				break;
		}
		window.setTimeout(function() {
			$triggered.css({ "background-color": triggeredColor, opacity: "1" });
			window.setTimeout(function() {
				$triggered.css({ "background-color": id, opacity: "0.3" });
				if (!clicked) {
					color = color.next;
					if (color !== null) {
						if(on) triggerColor(color.color, 300, 750, false);
					} else {
						currentColor = sequence.first;
						machine = false;
						human = true;
					}
				}
			}, t2);
		}, t1);
	}

	function updateCount() {
		if (count === 21) {
			$.confirm({
				title: "Congratulations! You won! :D",
				content: "Click button to continue playing.",
				theme: "my-theme",
				buttons: {
					nextMatch: {
						text: "Restart",
						action: function() {
							window.setTimeout(function() {
								startGame();
							}, 500);
						}
					}
				}
			});
		} else if (count < 10) {
			$num.text("0" + count);
		} else {
			$num.text(count);
		}
	}

	function playSequence() {
		human = false;
		color = sequence.first;
		if(on) triggerColor(color.color, 300, 750, false);
	}

	function playErrorMessage(strict) {
		$num.fadeTo(250, 0);
		$num.text("!!!");
		$num.fadeTo(250, 1);
		for(var i = 1; i <= 3; i++) {
			$num.fadeTo(250, 0);
			$num.fadeTo(250, 1);
		}
	}
});
