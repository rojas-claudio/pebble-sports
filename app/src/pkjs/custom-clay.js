module.exports = function(minified) {
    var clayConfig = this;
    var _ = minified._;
    var $ = minified.$;
    var HTML = minified.HTML;

    clayConfig.on(clayConfig.EVENTS.BEFORE_BUILD, function () {
		clayConfig.getItemById('nflTimeline').$element.set({
            $defaultValue: ["testing!"],
			$options: ["testing!"]
		});
        
    });
    clayConfig.build();


}