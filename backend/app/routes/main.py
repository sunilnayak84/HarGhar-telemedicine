from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User
from app.models.health_record import HealthRecord
from app.services.symptom_checker import check_severity
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.medication import Medication
from datetime import datetime


main = Blueprint('main', __name__)


@main.route('/')
def index():
    return jsonify({"message": "Welcome to HarGhar API"}), 200


@main.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"}), 200


@main.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201


@main.route('/api/health_check', methods=['POST'])
@jwt_required()
def create_health_record():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    data = request.json
    symptoms = data.get('symptoms')

    severity = check_severity(symptoms)

    health_record = HealthRecord(user_id=user.id, symptoms=symptoms, severity=severity)
    db.session.add(health_record)
    db.session.commit()

    advice = "Please consult a doctor immediately." if severity == 'high' else \
        "Monitor your symptoms closely and consult a doctor if they worsen." if severity == 'medium' else \
            "Rest and monitor your symptoms. Consult a doctor if they persist or worsen."

    return jsonify({
        "message": "Health check recorded",
        "severity": severity,
        "advice": advice
    }), 201


@main.route('/api/users/health_records', methods=['GET'])
@jwt_required()
def get_user_health_records():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    health_records = [
        {
            "id": record.id,
            "symptoms": record.symptoms,
            "severity": record.severity,
            "created_at": record.created_at.isoformat()
        }
        for record in user.health_records
    ]
    return jsonify(health_records), 200


# New routes for user profile

@main.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    return jsonify(username=user.username, email=user.email), 200


@main.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)

    db.session.commit()
    return jsonify(message="Profile updated successfully"), 200


@main.route('/api/medications', methods=['POST'])
@jwt_required()
def add_medication():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    data = request.json
    print('Received medication data:', data)  # Add this line

    try:
        new_medication = Medication(
            user_id=user.id,
            name=data['name'],
            dosage=data['dosage'],
            frequency=data['frequency'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None
        )
        db.session.add(new_medication)
        db.session.commit()
        print('Medication added successfully')  # Add this line
        return jsonify({"message": "Medication added successfully"}), 201
    except Exception as e:
        print('Error adding medication:', str(e))  # Add this line
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@main.route('/api/medications', methods=['GET'])
@jwt_required()
def get_medications():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    medications = [
        {
            "id": med.id,
            "name": med.name,
            "dosage": med.dosage,
            "frequency": med.frequency,
            "start_date": med.start_date.isoformat(),
            "end_date": med.end_date.isoformat() if med.end_date else None
        }
        for med in user.medications
    ]

    return jsonify(medications), 200

