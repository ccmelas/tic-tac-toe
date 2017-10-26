import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	let className = 'square' + props.identity;
	return (
		<button className={className} onClick={props.onClick}>
			{props.value}
		</button>
	);
}
	
class Board extends React.Component {
	
	renderSquare(i) {
		let is_a_winner = this.props.winning.find((winner) => {
			return winner === i;
		});
		let identity = '';
		if(is_a_winner) {
			identity = ' winner';
		}
		return (<Square key={i} value={this.props.squares[i]}
		onClick={() => this.props.onClick(i)}
		identity={identity}/>);
	}
	
	render() {
		let layout = [];
		let columns = [];
		let squareNumber = 0;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				columns.push(this.renderSquare(squareNumber));
				squareNumber++;
			}
			layout.push(<div key={i} className="board-row">{columns}</div>);
			columns = [];
		}
		
		return (<div>{layout}</div>);
	}
}
	
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history : [{
				squares: Array(9).fill(null)
			}],
			coordinates: [],
			xIsNext: true,
			stepNumber: 0,
			inReverse: false,
			counter: 0
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const model_coordinates = [
			"(1, 1)", "(1, 2)", "(1, 3)",
			"(2, 1)", "(2, 2)", "(2, 3)",
			"(3, 1)", "(3, 2)", "(3, 3)"
		];

		const coordinates = this.state.coordinates.slice();
		coordinates[history.length] = model_coordinates[i];
		
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		
		this.setState({
			history: history.concat([{squares: squares}]),
			coordinates: coordinates,
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	toggleOrder() {
		this.setState({
			inReverse: !this.state.inReverse
		});	
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		const moves = history.map((step, move, history) => {			
			let filtered_coordinates = this.state.coordinates.filter(coordinate => coordinate !== null);
			const desc = move ? 'Go to move #' + move + ' ' + filtered_coordinates[move - 1]: 'Go to game start';

			if (history.length - 1 === move) {
				return (<li key={move}><button onClick={() => this.jumpTo(move)}><b>{desc}</b></button></li>);
			} else {
				return (<li key={move}><button onClick={() => this.jumpTo(move)}>{desc}</button></li>);
			}
		});
		if(this.state.inReverse) {
			moves.reverse();
		}
		let status;
		let winning_squares = [];
		
		if (winner) {
			status = 'Winner: ' + winner.winner;
			winning_squares = winner.winning_squares;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} winning={winning_squares} onClick={(i) => this.handleClick(i)} />
				</div>
				<div className="game-info">
					<div><button onClick={() => this.toggleOrder()}>Toggle Order</button></div>
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}
	
// ========================================
	
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {winner: squares[a], winning_squares: lines[i]};
		}
	}
	return null;
}