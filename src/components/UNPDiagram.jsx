export default function UNPDiagram({ currentStepFilter, setCurrentStepFilter }) {
  const steps = [
    { id: 1, title: 'Commitment' },
    { id: 2, title: 'Governance' },
    { id: 3, title: 'Vision' },
    { id: 4, title: 'Stakeholders' },
    { id: 5, title: 'Analysis' },
    { id: 6, title: 'Co-develop' },
    { id: 7, title: 'Action Plan' },
    { id: 8, title: 'Implement' },
    { id: 9, title: 'Monitor' },
    { id: 10, title: 'Review' }
  ]

  const handleStepClick = (stepId) => {
    setCurrentStepFilter(currentStepFilter === stepId ? null : stepId)
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        The 10-Step Urban Nature Plan Cycle
      </h2>
      <div className="card-component p-2">
        <div className="flex overflow-x-auto">
          {steps.map(step => (
            <div
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`unp-step flex-shrink-0 text-center ${
                currentStepFilter === step.id ? 'active' : ''
              }`}
            >
              <div className="text-xs text-gray-500">STEP {step.id}</div>
              <div className="font-bold">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}