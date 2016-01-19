var Thesaurus = React.createClass({
	render: function () {
		return (
			<div>
				<SearchInputDiv wordLookup={this.wordLookup}/>
				<ResultsDiv word={this.state.word}/>
			</div>
		);
	},
	getInitialState: function () {
		'use strict';
		return ({
			word: ''
		});
	},
	wordLookup: function(word) {
		'use strict';
		this.setState({
			word: word
		});
	}
})

var SearchInputDiv = React.createClass({
	render: function () {
		'use strict';
		return (
			<div className='searchGroup'>
				<input ref='searchInput' className='searchInput' placeholder='Search Synonyms' type='text'/>
				<span ref='searchIcon' className='searchIcon'><i className="fa fa-search"></i></span>
				<div ref='searchError' className='searchError'>
					<p></p>
				</div>
			</div>
		); 
	},
	enterKeySearch: function (ev) {
		'use strict';
		if (ev && ev.keyCode && ev.keyCode === 13) {
			this.searchWord();
		}
	},
	searchWord: function () {
		'use strict';
		var word = this.refs.searchInput.value;
		if (word) {
			this.props.wordLookup(word);
		}
	},
	subscribeToWords: function () {
		'use strict';
		this.pubsub_token = PubSub.subscribe('wordLookup', function(topic, word) {
			this.refs.searchInput.value = word;
			this.props.wordLookup(word);
		}.bind(this));
	},
	componentDidMount: function () {
		'use strict';
		var searchIcon = this.refs.searchIcon,
			searchInput = this.refs.searchInput;
		searchIcon.addEventListener('click', this.searchWord);
		searchInput.addEventListener('keydown', this.enterKeySearch);
		this.subscribeToWords();
	}
});

var ResultsDiv = React.createClass({
	render: function () {
		'use strict';
		var entryObj = this.state.entry,
			entryKeys = Object.keys(entryObj),
			resultNodes;
		resultNodes = entryKeys.map(function (partOfSpeech) {
				if (entryObj[partOfSpeech].syn) {
					return (
						<ResultDiv results={entryObj[partOfSpeech].syn} partOfSpeech={partOfSpeech} />
					);
				}
			});
		return (
			<div className='resultsDiv'>
				{resultNodes}
			</div>
		);
	},
	getInitialState: function () {
		'use strict';
		return {
			word: '',
			entry: ''
		};
	},
	componentWillReceiveProps: function (nextProps) {
		'use strict';
		this.callThesaurusApi(nextProps.word);
	},
	callThesaurusApi: function(word) {
		'use strict';
		if (word) {
			$.ajax({
				dataType: 'json',
				data: {
					word: word
				},
				url: '/thesaurus_api',
				success: function(data) {
					console.log(data);
					this.setState({
						word: word,
						entry: data
					});
				}.bind(this),
				error: function(jqXHR, status, statusMessage) { 
					debugger
					console.log(status, statusMessage);
				}
			});
		}
	}
});

var ResultDiv = React.createClass({
	render: function () {
		'use strict';
		var wordNodes = this.props.results.map(function (word) {
			return (
				<WordListItem word={word} />
			)
		});
		return (
			<div className={this.props.partOfSpeech + " resultDiv"}>
				<span className="resultsTitle">{this.props.partOfSpeech}</span>
				<ul className="wordList">
					{wordNodes}
				</ul>
			</div>
		);
	}
});

var WordListItem = React.createClass({
	render: function () {
		'use strict';
		return (
			<li ref="wordButton" className="word">
				{this.props.word}
			</li>
		);
	},
	publishWord: function () {
		'use strict';
		PubSub.publish('wordLookup', this.props.word)
	},
	componentDidMount: function () {
		'use strict';
		this.refs.wordButton.addEventListener('click', this.publishWord);
	}
});

ReactDOM.render(
	<Thesaurus/>,
	document.getElementById('content')
);