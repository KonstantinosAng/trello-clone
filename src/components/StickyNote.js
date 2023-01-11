import React, { memo, useEffect, useRef, useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import { IconButton } from '@material-ui/core'
import PaletteIcon from '@material-ui/icons/Palette'
import {
	deleteNote,
	updateNoteColor,
	updateNoteNotes,
	updateNotePosition,
	updateNoteTitle,
} from '../utils/functions'

function StickyNote({ user, projectID, color, title, id, x, y, notes }) {
	const ref = useRef()
	const headerRef = useRef()
	const [titleValue, setTitleValue] = useState(title)
	const [notesValue, setNotesValue] = useState(notes)
	const [showInput, setShowInput] = useState(false)
	const [isClicked, setIsClicked] = useState(false)
	const [showColors, setShowColors] = useState(false)
	const [notePosition, setNotePosition] = useState({ x, y })

	/* Update note title and notes */
	useEffect(() => {
		if (!showInput) {
			updateNoteTitle(user, projectID, id, titleValue)
			updateNoteNotes(user, projectID, id, notesValue)
		}
	}, [showInput, user, projectID, id, titleValue, notesValue])

	const getPosition = (mouseX, mouseY) => {
		const height = ref?.current?.clientHeight
		const width = ref?.current?.clientWidth
		const headerHeight = headerRef?.current?.clientHeight
		return {
			x:
				mouseX < width / 2 + 15
					? 0
					: `min(${window.innerWidth - width - 2}px, ${mouseX - width / 2}px)`,
			y:
				mouseY < 15
					? 0
					: `min(${window.innerHeight - height - 1}px , ${mouseY - headerHeight / 2}px)`,
		}
	}

	const initialPosition = getPosition(x, y)

	/* Update note color */
	const handleColorUpdate = colorName => {
		color = colorName
		updateNoteColor(user, projectID, id, colorName)
	}

	/* Update note title */
	const handleTitleUpdate = e => {
		setTitleValue(e.target.value)
	}

	/* Update note notes */
	const handleNotesUpdate = e => {
		setNotesValue(e.target.value)
	}

	/* Mouse Up event listener */
	const handleMouseUp = async () => {
		setIsClicked(false)
		await updateNotePosition(user, projectID, id, notePosition.x, notePosition.y)
	}

	/* Mouse Down event listener */
	const handleMouseDown = element => {
		setIsClicked(true)
	}

	/* Handle Move event listener */
	const handleMouseMove = e => {
		if (isClicked) {
			const x = e?.clientX ?? e?.touches[0]?.clientX ?? 0
			const y = e?.clientY ?? e?.touches[0]?.clientY ?? 0
			setNotePosition({
				x,
				y,
			})
			const position = getPosition(x, y)
			ref.current.style.top = position.y
			ref.current.style.left = position.x
		}
	}

	useEffect(() => {
		if (isClicked) {
			window.addEventListener('mousemove', handleMouseMove)
			window.addEventListener('touchmove', handleMouseMove)
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('touchmove', handleMouseMove)
		}
	}, [isClicked])

	return (
		<div
			ref={ref}
			id={id}
			style={{ top: initialPosition.y, left: initialPosition.x }}
			className={`fixed flex flex-col w-[21rem] h-[23rem] rounded-sm text-gray-800 ${color}`}
		>
			<div
				ref={headerRef}
				style={{ cursor: 'grab' }}
				onTouchStart={handleMouseDown}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onTouchEnd={handleMouseUp}
				className='bg-white bg-opacity-10 flex items-center justify-center'
			>
				<DragHandleIcon className='hover:bg-opacity-20 hover:w-10 hover:h-10 flex-grow' />
			</div>
			{showInput ? (
				<>
					<input
						className={`${color} text-2xl font-bold p-5 pr-0 outline-none`}
						value={titleValue}
						onChange={e => handleTitleUpdate(e)}
					/>
					<textarea
						className={`${color} px-5 text-base font-medium outline-none`}
						value={notesValue}
						onChange={e => handleNotesUpdate(e)}
					/>
				</>
			) : (
				<>
					<h1 className='text-2xl font-bold p-5 pr-0'> {titleValue} </h1>
					<p className='px-5 text-base font-medium'>{notesValue}</p>
				</>
			)}
			<div className='absolute bottom-3 right-3'>
				<IconButton
					onClick={() => setShowInput(!showInput)}
					className='w-9 h-9 focus:outline-none active:outline-none shadow-inner'
				>
					<EditIcon className='w-6 h-6 cursor-pointer text-gray-800 focus:outline-none active:outline-none' />
				</IconButton>
				<IconButton
					onClick={() => setShowColors(!showColors)}
					className='w-9 h-9 focus:outline-none active:outline-none shadow-inner'
				>
					<PaletteIcon className='w-6 h-6 cursor-pointer text-gray-800 focus:outline-none active:outline-none' />
				</IconButton>
				<IconButton
					onClick={() => deleteNote(user, projectID, id)}
					className='w-9 h-9 focus:outline-none active:outline-none shadow-inner'
				>
					<DeleteIcon className='w-6 h-6 cursor-pointer text-gray-800 focus:outline-none active:outline-none' />
				</IconButton>
			</div>
			{showColors && (
				<div
					onMouseLeave={() => setShowColors(false)}
					className='absolute bottom-[-2.5rem] flex flex-grow items-center w-full h-[2.5rem] shadow-lg outline-none'
				>
					<button
						onClick={() => handleColorUpdate('bg-red-500')}
						className='bg-red-500 w-full flex-grow h-full outline-none'
					/>
					<button
						onClick={() => handleColorUpdate('bg-green-500')}
						className='bg-green-500 w-full flex-grow h-full outline-none'
					/>
					<button
						onClick={() => handleColorUpdate('bg-blue-500')}
						className='bg-blue-500 w-full flex-grow h-full outline-none'
					/>
					<button
						onClick={() => handleColorUpdate('bg-indigo-500')}
						className='bg-indigo-500 w-full flex-grow h-full outline-none'
					/>
					<button
						onClick={() => handleColorUpdate('bg-yellow-500')}
						className='bg-yellow-500 w-full flex-grow h-full outline-none'
					/>
					<button
						onClick={() => handleColorUpdate('bg-pink-500')}
						className='bg-pink-500 w-full flex-grow h-full outline-none'
					/>
				</div>
			)}
		</div>
	)
}

export default StickyNote
