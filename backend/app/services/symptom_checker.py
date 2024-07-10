def check_severity(symptoms):
    # This is a very basic symptom checker. In a real application,
    # this would be much more sophisticated.
    high_risk_symptoms = ['difficulty breathing', 'chest pain', 'unconsciousness']
    medium_risk_symptoms = ['fever', 'persistent cough', 'severe pain']

    symptoms_list = [s.strip().lower() for s in symptoms.split(',')]

    if any(symptom in symptoms_list for symptom in high_risk_symptoms):
        return 'high'
    elif any(symptom in symptoms_list for symptom in medium_risk_symptoms):
        return 'medium'
    else:
        return 'low'