import { createContext, useContext, useState } from "react"
import Swal from "sweetalert2"

const MainContent = createContext()
export function useMain() {
	return useContext(MainContent)
}

const MainComponent = ({ children }) => {
	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer)
			toast.addEventListener("mouseleave", Swal.resumeTimer)
		},
	})
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().slice(0, 10).replace(/-/g, "/")
	)
	const [selectedMuscle, setSelectedMuscle] = useState(null)
	const [selectedWorkout, setSelectedWorkout] = useState(null)
	const [showPreloader, setShowPreloader] = useState(null)
	const handleDateChange = (date) => {
		setSelectedDate(date)
	}
	const handleMuscleSelect = (muscle) => {
		setSelectedMuscle(muscle)
		setSelectedWorkout("") // Reset selected workout when a new muscle is selected
	}
	const handleWorkoutSelect = (workout) => {
		setSelectedWorkout(workout)
	}
	return (
		<MainContent.Provider
			value={{
				Toast,
				selectedDate,
				selectedMuscle,
				selectedWorkout,
				handleDateChange,
				handleMuscleSelect,
				handleWorkoutSelect,
				showPreloader,
				setShowPreloader,
			}}
		>
			{children}
		</MainContent.Provider>
	)
}

export default MainComponent
