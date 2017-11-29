	var curprod;
	var points = 0;
	var completed = 0;
	var testScorePoints = '.test-score-points-update';

	$(document).ready(function(){

		function mobileTable()
		{
			var ct = 0;
			$( '.toxic-table-col-heading' ).each( function() {
				++ct;
				if ( ct == 2 )
				{
					$( this ).addClass( 'hide-mobile' );
				}
			});
			
			// $( '.ingredient-checkbox-col' ).attr( 'valign', 'top' );
			
			/** Mobile Table **/
			$( 'td.ingredient-concern-col' ).each( function() {
				var html = $( this ).html();
				var current = $( this ).prev( 'td.ingredient-name-col' ).html();
				$( this ).prev( 'td.ingredient-name-col' ).html( '<div class="mobile-bold">' + current + '</div><div class="show-mobile">' + html + '<hr /></div>' );
				$( this ).addClass( 'hide-mobile' );
			});
		}
	
		$( '.product-link' ).addClass( 'begin-section' );
		
		$( '.product-link' ).click(function(){
		
			var nextProduct = $( this ).attr( 'data-next' );
			changeNextProductURL( nextProduct );
			
			if ( !$( this ).hasClass( 'complete' ) ) 
			{
				$( this ).removeClass( 'begin-section' );
				$( this ).addClass( 'in-progress' );
				
				var page = $( this ).attr( 'data' ) + '.htm';
				loadPage( page );
				curprod = $( this ).attr( 'data' );
				
				$( '#loadproductinfocontainer' ).css( 'display', 'block' );
				scrollToInfo( '#loadproductinfocontainer' );
				
				if ( !$( this ).hasClass( 'prodselect' ) )
				{
					calculatePoints();
					$( this ).addClass( 'prodselect' );
				}
				
				$( testScorePoints ).html( points );
				
				if ( points > 40 && points <= 100 ) 
				{
					$( '.foot-grade' ).attr( 'src', 'images/footer-grade-F.jpg' );
				} 
				else 
				{
					$( '.foot-grade' ).attr( 'src', 'images/footer-grade-start.jpg' );
				}
				
				$( '#popup-grade' ).attr( 'src', 'images/score-' + points + '-overlay.png' );	
			}
			
		});
		
		function changeNextProductURL( URL )
		{
			if ( URL == '' )
			{
				URL = $( '.second-row-first-product' ).attr( 'data' );
			}
			
			URL = URL.replace( 'product-', '' );
			
			$( '#change-next-product-url' ).attr( 'href', URL );
		}
		
		function loadPage( page )
		{
			console.log( 'change page to ' + page );
			
			$( '#loadproductinfo' ).load( page + '?v=2', function(){
				$( 'input[type="checkbox"]' ).click(function() {
				
					if ( $( this ).is( ':checked' ) )
					{
						points = points + 10;
						
						if ( points > 100 )
						{
							points = 100;
						}
						
						if ( points < 0 )
						{
							points = 0;
						}
						
						$( testScorePoints ).html( points );
					} 
					else 
					{
						points = points - 10;
						
						if ( points > 100 )
						{
							points = 100;
						}
						
						if ( points < 0 )
						{
							points = 0;
						}
						
						$( testScorePoints ).html( points );
					}
					
				  
					if ( points > 40 && points <= 100 )
					{
						$( '.foot-grade' ).attr( 'src', 'images/footer-grade-F.jpg' );
					} else {
						$( '.foot-grade' ).attr( 'src', 'images/footer-grade-start.jpg' );
					}
					
					$( '#popup-grade' ).attr( 'src', 'images/score-' + points + '-overlay.png' );
				});
				
				console.log( 'data has been loaded' );
				mobileTable();
			});
		}
		
		$( 'body' ).on( 'click', '.product-complete-link', function() 
		{	
			/**
			$( '.product-link' ).each(function()
			{
				if ( $( this ).attr( 'data' ) == curprod ) {
					$( this ).removeClass( 'in-progress' );
					$( this ).addClass( 'complete' );
				}
			});
			**/
			
			++completed;
			$( '.complete-sections-count' ).html( completed );
			$( '.product-link.in-progress' ).addClass( 'complete' ).removeClass( 'in-progress' );
			
			var base = $( this ).attr( 'href' );
			$( '#product-' + base ).addClass( 'in-progress' );
			
			if ( base != 'end' )
			{
				var nextProduct = $( '#product-' + base ).attr( 'data-next' );
				changeNextProductURL( nextProduct );
				console.log( 'Base: ' + base );
				console.log( 'Next Product: ' + nextProduct );
				
				var page = 'product-' + base + '.htm';
				loadPage( page );
				
				curprod = $( this ).attr( 'data' );
				scrollToInfo( '#loadproductinfocontainer' );
			}
			else
			{
				$( '#loadproductinfocontainer' ).css( 'display', 'none' );
				scrollBack( '.product-list' );
				
				if ( completed >= 10 ) 
				{
					if ( points <= 10 )
					{
						$( '.foot-grade' ).attr( 'src', 'images/footer-grade-A.jpg' );
					}
					
					if ( points > 10 && points <= 40 )
					{
						$( '.foot-grade' ).attr( 'src', 'images/footer-grade-C.jpg' );
					}
					
					if ( points > 40 && points <= 100 )
					{
						$( '.foot-grade' ).attr( 'src', 'images/footer-grade-F.jpg' );
					}
				}
			}
			
			return false;
		});
		
		$( '.return-link' ).click(function()
		{
			$( '#loadproductinfocontainer' ).css( 'display', 'none' );
		});
		
		$( '.score-information' ).click( function()
		{
			$( '#score-popup' ).css( 'display', 'block' );
		});
		
		$( '#score-popup' ).click(function()
		{
			$( this ).css( 'display', 'none' );
		});
	});

	function calculatePoints()
	{
		points = points + 30;
		
		if ( points > 100 )
		{
			points = 100;
		}
	}

	function scrollToInfo( aid )
	{
		var aTag = $( aid );
		$( 'html,body' ).animate({ scrollTop: aTag.offset().top+100 }, 'slow' );
	}

	function scrollBack( aid )
	{
		var aTag = $( aid );
		$( 'html,body' ).animate({ scrollTop: aTag.offset().top-100 }, 'slow' );
	}
