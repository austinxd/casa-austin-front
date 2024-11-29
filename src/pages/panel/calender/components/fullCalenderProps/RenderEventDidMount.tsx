export default function RenderEventDidMount({ info }: any) {
    let usedColors: any = []
    if (info.isStart) {
        const firstDayCell = info.el.closest('.fc-event')
        if (firstDayCell) {
            firstDayCell.style.background = 'innerth'
            const parentRow = firstDayCell.closest('.fc-scrollgrid-section')
            if (parentRow) {
                const firstDayOfRow = parentRow.querySelector('.fc-day')
                if (firstDayOfRow === info.el) {
                    firstDayCell.style.marginLeft = '14px'
                }
            }
        }
    } else {
        info.el.style.background = 'innerth'
        info.el.style.marginLeft = '0px'
        info.el.style.borderTopLeftRadius = '0px'
        info.el.style.borderBottomLeftRadius = '0px'
    }
    if (info.event.extendedProps.lateCheckout) {
        info.el.style.marginRight = '-21px'
        if (window.innerWidth < 900) {
            info.el.style.marginRight = '-16px'
        }
    }
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    const eventDate = new Date(info.event.end)
    eventDate.setHours(0, 0, 0, 0)

    const isPastDate = eventDate < currentDate
    if (isPastDate) {
        info.el.style.backgroundColor = info.event.backgroundColor
        info.el.style.opacity = '0.35'
    }

    if (info.isEnd) {
        const endDate = info.event.end
        const endDayCell = document.querySelector(
            `.fc-day[data-date="${endDate.toISOString().slice(0, 10)}"]:first-of-type .fc-daygrid-day-events`
        )
        if (endDayCell) {
            const eventColor = info.event.backgroundColor
            if (!usedColors.includes(eventColor)) {
                const box = document.createElement('div')
                box.style.height = '25px'
                if (info.event.extendedProps.lateCheckout) {
                    box.style.width = '32px'
                    if (window.innerWidth < 900) {
                        box.style.width = '12px'
                    }
                }
                box.style.width = '12px'
                box.style.backgroundColor = eventColor
                box.style.borderTopRightRadius = '12px'
                box.style.borderBottomRightRadius = '12px'
                box.style.marginTop = '2px'
                if (isPastDate) {
                    box.style.opacity = '0.4'
                }
                if (window.innerWidth < 900) {
                    box.style.height = '6px'
                    box.style.width = '4px'
                    box.style.marginTop = '1px'
                }

                endDayCell.appendChild(box)
                usedColors.push(eventColor)
            }
        }
    }
}
