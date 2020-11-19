(function() {
	window.Main = {};
	Main.Page = (function() {
		var mosq = null;
		function Page() {
			var _this = this;
			mosq = new Mosquitto();

			$(window).load(function() {
				return _this.connect();
			});
			  
			$(window).unload(function() {
				return _this.disconnect();
			});

			$('#subscribe-button').click(function() {
				return _this.subscribe();
			});
			$('#unsubscribe-button').click(function() {
				return _this.unsubscribe();
			});
			
			
			$('#liga-output').click(function() {
				var payload = "L";  
				var TopicPublish = "MQTTGWEnvia"; //$('#pub-topic-text')[0].value;				
				mosq.publish(TopicPublish, payload, 0);
			});

			$('#desliga-output').click(function() {
				var payload = "D";  
				var TopicPublish = "MQTTGWEnvia"; //$('#pub-topic-text')[0].value;				
				mosq.publish(TopicPublish, payload, 0);
			});

			mosq.onconnect = function(rc){
				var p = document.createElement("p");
				var topic = "MQTTGWRecebe"; //$('#pub-subscribe-text')[0].value;
				p.innerHTML = "Conectado ao Broker!";
				$("#debug").append(p);
				mosq.subscribe(topic, 0);
				
			};
			mosq.ondisconnect = function(rc){
				var p = document.createElement("p");
				var url = "ws://mqtt.eclipse.org:80/mqtt";
				
				p.innerHTML = "A conexão com o broker foi perdida";
				$("#debug").append(p);				
				mosq.connect(url);
			};
			mosq.onmessage = function(topic, payload, qos){
				var p = document.createElement("p");
				var acao = payload[0];
				
				//escreve o estado do output conforme informação recebida
				if (acao == 'L')
					p.innerHTML = "<i class='far fa-lightbulb lamp lamp-on'></i>"
				else
					p.innerHTML = "<i class='far fa-lightbulb lamp'></i>"
				
				$("#box-lamp").html(p);
				//$("#status_io").html(p);
			};
		}
		Page.prototype.connect = function(){
			var url = "ws://mqtt.eclipse.org:80/mqtt";
			mosq.connect(url);
		};
		Page.prototype.disconnect = function(){
			mosq.disconnect();
		};
		Page.prototype.subscribe = function(){
			var topic = "MQTTGWEnvia"; //$('#sub-topic-text')[0].value;
			mosq.subscribe(topic, 0);
		};
		Page.prototype.unsubscribe = function(){
			var topic = "MQTTGWEnvia"; //$('#sub-topic-text')[0].value;
			mosq.unsubscribe(topic);
		};
		
		return Page;
	})();
	$(function(){
		return Main.controller = new Main.Page;
	});
}).call(this);

