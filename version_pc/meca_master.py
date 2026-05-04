"""
🖥️ MECA MASTER - VERSION PC
Application desktop Windows avec PyQt5
Interface moderne + IA embarquée
Génère un fichier .exe avec PyInstaller
"""

import sys
import os
from datetime import datetime
from random import choice, randint

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QLineEdit, QTextEdit, QScrollArea, QFrame,
    QStackedWidget, QGridLayout, QProgressBar, QGraphicsDropShadowEffect,
    QSizePolicy, QSpacerItem, QSplitter, QToolButton, QMenu, QAction,
    QSystemTrayIcon, QStyle, QComboBox, QDialog, QMessageBox, QFileDialog
)
from PyQt5.QtCore import (
    Qt, QSize, QTimer, QThread, pyqtSignal, QPropertyAnimation,
    QEasingCurve, QPoint, QRect
)
from PyQt5.QtGui import (
    QFont, QIcon, QColor, QPalette, QLinearGradient, QBrush,
    QPainter, QPen, QFontDatabase, QPixmap, QCursor
)

# ═════════════════════════════════════════════════════════════════════════════
# 🎨 CONSTANTES ET COULEURS
# ═════════════════════════════════════════════════════════════════════════════

COLORS = {
    'primary': '#FF8C42',
    'primary_light': '#FF6B35',
    'secondary': '#00D4FF',
    'success': '#10b981',
    'danger': '#ef4444',
    'warning': '#f59e0b',
    'purple': '#8b5cf6',
    'dark': '#0f0f23',
    'dark_light': '#1a1a3e',
    'card': '#16213e',
    'text': '#ffffff',
    'text_secondary': 'rgba(255,255,255,0.7)',
    'border': 'rgba(255,255,255,0.1)'
}

STYLESHEET = """
QMainWindow {
    background-color: #0f0f23;
    color: #ffffff;
}

QWidget {
    font-family: 'Segoe UI', 'Inter', sans-serif;
}

/* Sidebar */
#sidebar {
    background-color: #0f0f23;
    border-right: 1px solid rgba(255,255,255,0.1);
}

#sidebar_btn {
    background-color: transparent;
    color: rgba(255,255,255,0.7);
    border: none;
    padding: 12px 20px;
    text-align: left;
    font-size: 14px;
    border-radius: 12px;
    margin: 4px 8px;
}

#sidebar_btn:hover {
    background-color: rgba(255,255,255,0.05);
    color: #ffffff;
}

#sidebar_btn:checked {
    background-color: rgba(255,140,66,0.2);
    color: #FF8C42;
    border-left: 3px solid #FF8C42;
}

/* Cards */
QFrame#card {
    background-color: #16213e;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 20px;
}

/* Buttons */
QPushButton#primary_btn {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
        stop:0 #FF8C42, stop:1 #FF6B35);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
}

QPushButton#primary_btn:hover {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
        stop:0 #FF9A5C, stop:1 #FF7A4A);
}

QPushButton#sos_btn {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
        stop:0 #ef4444, stop:1 #dc2626);
    color: white;
    border: none;
    border-radius: 16px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
}

QPushButton#icon_btn {
    background-color: transparent;
    color: rgba(255,255,255,0.6);
    border: none;
    border-radius: 12px;
    padding: 8px;
    font-size: 20px;
}

QPushButton#icon_btn:hover {
    background-color: rgba(255,255,255,0.1);
    color: white;
}

/* Inputs */
QLineEdit, QTextEdit {
    background-color: #1a1a3e;
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
}

QLineEdit:focus, QTextEdit:focus {
    border-color: #FF8C42;
}

/* Scrollbars */
QScrollBar:vertical {
    background: #0f0f23;
    width: 8px;
    border-radius: 4px;
}

QScrollBar::handle:vertical {
    background: #FF8C42;
    border-radius: 4px;
    min-height: 30px;
}

QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0px;
}

/* Progress bar */
QProgressBar {
    background-color: #1a1a3e;
    border-radius: 6px;
    text-align: center;
    color: white;
}

QProgressBar::chunk {
    background-color: #FF8C42;
    border-radius: 6px;
}

/* Labels */
QLabel#title {
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
}

QLabel#subtitle {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
}

QLabel#card_title {
    color: #FF8C42;
    font-size: 16px;
    font-weight: 600;
}

QLabel#amount {
    color: #ffffff;
    font-size: 32px;
    font-weight: 700;
}
"""

# ═════════════════════════════════════════════════════════════════════════════
# 🤖 IA EMBARQUÉE
# ═════════════════════════════════════════════════════════════════════════════

class PCAI:
    """IA simulée pour version PC"""
    
    def __init__(self):
        self.responses = {
            'moteur': [
                "Le bruit de cliquetis peut indiquer un problème de soupapes. Vérifiez le niveau d'huile.",
                "Une fumée blanche persistante = possible joint de culasse défectueux. Consultez rapidement un mécanicien.",
                "Surchauffe moteur : ARRÊTEZ immédiatement et laissez refroidir 30 minutes minimum.",
                "Démarrage difficile = batterie faible (vérifiez les cosses) ou bougies usées."
            ],
            'freins': [
                "Grincements = plaquettes usées à 90%. Prix changement : 25 000 - 45 000 FCFA en Côte d'Ivoire.",
                "Pédale molle = purge du circuit hydraulique nécessaire (15 000 - 25 000 FCFA).",
                "Vibration au freinage = disques voilés. Changement disques + plaquettes : 60 000 - 100 000 FCFA.",
                "Vérifiez vos freins tous les 20 000 km minimum pour votre sécurité."
            ],
            'pneus': [
                "Pression à vérifier mensuellement. Sous-gonflage = surconsommation + usure prématurée.",
                "Pneus à remplacer tous les 40 000-60 000 km ou tous les 5 ans maximum.",
                "Prix pneus en Côte d'Ivoire : 35 000 - 80 000 FCFA selon taille et marque.",
                "Une crevaison sur bande de roulement est réparable avec une mèche (5 000 - 10 000 FCFA)."
            ],
            'vidange': [
                "Vidange : tous les 10 000-15 000 km ou 1 an maximum selon le premier critère atteint.",
                "Prix vidange CI : 15 000 - 45 000 FCFA selon type d'huile (minérale/synthétique).",
                "N'oubliez jamais le filtre à huile lors de la vidange pour protéger le moteur.",
                "Huile synthétique : +30% cher mais dure 50% plus longtemps. Meilleur rapport qualité/prix."
            ],
            'climatisation': [
                "Plus de froid = manque de fluide frigorigène. Recharge : 15 000 - 25 000 FCFA.",
                "Odeurs dans l'habitacle = nettoyage filtre habitacle nécessaire (5 000 - 10 000 FCFA).",
                "Bruit anormal compresseur = courroie usée ou manque de fluide. Vérifiez rapidement.",
                "Utilisez la clim 5 minutes par semaine en hiver pour lubrifier le compresseur."
            ],
            'tarifs': [
                "Tarifs moyens en Côte d'Ivoire (2024) :",
                "• Vidange : 15 000 - 45 000 FCFA",
                "• Freins (plaquettes) : 25 000 - 45 000 FCFA",
                "• Pneu : 35 000 - 80 000 FCFA",
                "• Diagnostic électronique : 10 000 - 25 000 FCFA",
                "• Main d'œuvre : 8 000 - 20 000 FCFA/heure"
            ],
            'urgence': [
                "🆘 URGENCE MOTEUR :",
                "1. Mettez les warnings",
                "2. Arrêtez dans un endroit sûr",
                "3. Coupez le contact",
                "4. Appelez le SOS Meca Master",
                "5. N'essayez pas de redémarrer si fumée importante"
            ],
            'general': [
                "Bonjour ! Je suis MecaAI, votre expert automobile virtuel. Comment puis-je vous aider aujourd'hui ?",
                "Je peux vous conseiller sur : mécanique, tarifs, entretien, diagnostic, et urgences.",
                "Posez-moi vos questions ! Je réponds en moins de 2 secondes.",
                "💡 Conseil du jour : Vérifiez votre niveau d'huile toutes les 2 semaines."
            ]
        }
    
    def chat(self, message):
        msg = message.lower()
        
        if any(word in msg for word in ['moteur', 'bruit', 'fume', 'chauffe', 'cliquette']):
            return choice(self.responses['moteur'])
        elif any(word in msg for word in ['frein', 'plaque', 'grince', 'pédale']):
            return choice(self.responses['freins'])
        elif any(word in msg for word in ['pneu', 'creve', 'gonflage', 'pression', 'roue']):
            return choice(self.responses['pneus'])
        elif any(word in msg for word in ['vidange', 'huile', 'filtre']):
            return choice(self.responses['vidange'])
        elif any(word in msg for word in ['clim', 'climatisation', 'froid', 'chaud']):
            return choice(self.responses['climatisation'])
        elif any(word in msg for word in ['prix', 'coût', 'combien', 'tarif', 'cher', 'fcfa']):
            return '\n'.join(self.responses['tarifs'])
        elif any(word in msg for word in ['urgence', 'sos', 'panne', 'arrêt']):
            return '\n'.join(self.responses['urgence'])
        elif any(word in msg for word in ['bonjour', 'salut', 'hey', 'coucou']):
            return choice(self.responses['general'])
        else:
            return f"Je comprends votre question sur '{message}'.\n\nEn tant qu'expert automobile, je peux vous aider sur :\n\n🔧 Diagnostic et pannes\n💰 Tarifs en Côte d'Ivoire\n📍 Localisation de garages\n🚗 Entretien préventif\n🆘 Situations d'urgence\n\nPourriez-vous préciser votre besoin ?"

ai = PCAI()

# ═════════════════════════════════════════════════════════════════════════════
# 🎨 WIDGETS PERSONNALISÉS
# ═════════════════════════════════════════════════════════════════════════════

class ModernCard(QFrame):
    """Carte moderne glassmorphism"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setObjectName("card")
        self.setFrameShape(QFrame.StyledPanel)
        
        # Ombre
        shadow = QGraphicsDropShadowEffect()
        shadow.setBlurRadius(20)
        shadow.setColor(QColor(0, 0, 0, 60))
        shadow.setOffset(0, 4)
        self.setGraphicsEffect(shadow)

class SidebarButton(QPushButton):
    """Bouton de sidebar avec icône"""
    
    def __init__(self, icon, text, parent=None):
        super().__init__(parent)
        self.setObjectName("sidebar_btn")
        self.setCheckable(True)
        self.setText(f"{icon}  {text}")
        self.setCursor(Qt.PointingHandCursor)
        self.setMinimumHeight(44)

class IconButton(QPushButton):
    """Bouton icône circulaire"""
    
    def __init__(self, icon, parent=None):
        super().__init__(icon, parent)
        self.setObjectName("icon_btn")
        self.setFixedSize(40, 40)
        self.setCursor(Qt.PointingHandCursor)

# ═════════════════════════════════════════════════════════════════════════════
# 📱 ÉCRANS
# ═════════════════════════════════════════════════════════════════════════════

class HomeWidget(QWidget):
    """Page d'accueil"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
    
    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(30, 30, 30, 30)
        
        # Header avec bienvenue
        welcome = ModernCard()
        welcome_layout = QHBoxLayout(welcome)
        welcome_layout.setSpacing(20)
        
        # Avatar
        avatar = QLabel("👤")
        avatar.setStyleSheet("font-size: 48px;")
        welcome_layout.addWidget(avatar)
        
        # Info
        info = QVBoxLayout()
        subtitle = QLabel("Bienvenue 👋")
        subtitle.setObjectName("subtitle")
        info.addWidget(subtitle)
        
        name = QLabel("Jean Dupont")
        name.setStyleSheet("font-size: 24px; font-weight: 700; color: white;")
        info.addWidget(name)
        
        location = QLabel("📍 Abidjan, Cocody")
        location.setObjectName("subtitle")
        info.addWidget(location)
        
        info.addStretch()
        welcome_layout.addLayout(info, 1)
        
        layout.addWidget(welcome)
        
        # Actions rapides
        actions_title = QLabel("Actions rapides")
        actions_title.setStyleSheet("font-size: 18px; font-weight: 600; color: white; margin-top: 10px;")
        layout.addWidget(actions_title)
        
        actions = QGridLayout()
        actions.setSpacing(16)
        
        actions_list = [
            ("⚡", "SOS Urgence", COLORS['danger'], self.sos_clicked),
            ("🔍", "Diagnostic", COLORS['primary'], self.diagnostic_clicked),
            ("🔧", "Mécanicien", COLORS['secondary'], self.mechanic_clicked),
            ("🛒", "Marketplace", COLORS['purple'], self.marketplace_clicked),
        ]
        
        for i, (icon, text, color, callback) in enumerate(actions_list):
            btn = self.create_action_button(icon, text, color, callback)
            actions.addWidget(btn, i // 2, i % 2)
        
        layout.addLayout(actions)
        
        # Stats cards
        stats = QHBoxLayout()
        stats.setSpacing(20)
        
        # Véhicule
        vehicle_card = self.create_stat_card("🚗", "Mon véhicule", "Toyota Corolla", "État: Excellent (85%)", COLORS['primary'])
        stats.addWidget(vehicle_card)
        
        # Dépenses
        expense_card = self.create_expense_card()
        stats.addWidget(expense_card)
        
        layout.addLayout(stats)
        
        # Interventions récentes
        history_title = QLabel("Interventions récentes")
        history_title.setStyleSheet("font-size: 18px; font-weight: 600; color: white; margin-top: 10px;")
        layout.addWidget(history_title)
        
        history = ModernCard()
        history_layout = QVBoxLayout(history)
        
        interventions = [
            ("✅", "Vidange", "Pierre K.", "25,000 F", COLORS['success']),
            ("✅", "Freins", "Garage Auto Pro", "45,000 F", COLORS['success']),
            ("⏳", "Climatisation", "En attente", "35,000 F", COLORS['warning']),
        ]
        
        for icon, title, subtitle, amount, color in interventions:
            item = self.create_history_item(icon, title, subtitle, amount, color)
            history_layout.addWidget(item)
        
        layout.addWidget(history)
        layout.addStretch()
    
    def create_action_button(self, icon, text, color, callback):
        btn = QPushButton()
        btn.setFixedHeight(100)
        btn.setCursor(Qt.PointingHandCursor)
        btn.setStyleSheet(f"""
            QPushButton {{
                background-color: #16213e;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                text-align: center;
            }}
            QPushButton:hover {{
                background-color: rgba(255,255,255,0.05);
                border-color: {color};
            }}
        """)
        
        layout = QVBoxLayout(btn)
        layout.setSpacing(8)
        
        icon_label = QLabel(icon)
        icon_label.setStyleSheet(f"font-size: 32px; color: {color};")
        icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon_label)
        
        text_label = QLabel(text)
        text_label.setStyleSheet("font-size: 13px; color: rgba(255,255,255,0.8);")
        text_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(text_label)
        
        btn.clicked.connect(callback)
        return btn
    
    def create_stat_card(self, icon, title, subtitle, status, color):
        card = ModernCard()
        layout = QHBoxLayout(card)
        layout.setSpacing(16)
        
        icon_label = QLabel(icon)
        icon_label.setStyleSheet(f"font-size: 48px; color: {color};")
        layout.addWidget(icon_label)
        
        info = QVBoxLayout()
        
        title_lbl = QLabel(title)
        title_lbl.setStyleSheet(f"font-size: 16px; font-weight: 600; color: {color};")
        info.addWidget(title_lbl)
        
        sub = QLabel(subtitle)
        sub.setStyleSheet("font-size: 18px; font-weight: 700; color: white;")
        info.addWidget(sub)
        
        stat = QLabel(status)
        stat.setStyleSheet(f"font-size: 13px; color: {COLORS['success']};")
        info.addWidget(stat)
        
        # Barre de progression
        progress = QProgressBar()
        progress.setValue(85)
        progress.setTextVisible(False)
        progress.setFixedHeight(6)
        info.addWidget(progress)
        
        info.addStretch()
        layout.addLayout(info, 1)
        
        return card
    
    def create_expense_card(self):
        card = ModernCard()
        layout = QVBoxLayout(card)
        
        title = QLabel("💰 Dépenses ce mois")
        title.setStyleSheet(f"font-size: 16px; font-weight: 600; color: {COLORS['success']};")
        layout.addWidget(title)
        
        amount = QLabel("75,000 FCFA")
        amount.setStyleSheet("font-size: 32px; font-weight: 700; color: white;")
        layout.addWidget(amount)
        
        # Graphique simplifié
        chart = QLabel("▂▄▆█▅▇▄▃")
        chart.setStyleSheet("font-size: 24px; color: #FF8C42; letter-spacing: 4px;")
        chart.setAlignment(Qt.AlignCenter)
        layout.addWidget(chart)
        
        layout.addStretch()
        return card
    
    def create_history_item(self, icon, title, subtitle, amount, color):
        widget = QFrame()
        widget.setStyleSheet(f"""
            QFrame {{
                background-color: transparent;
                border-bottom: 1px solid rgba(255,255,255,0.05);
            }}
        """)
        layout = QHBoxLayout(widget)
        layout.setContentsMargins(0, 8, 0, 8)
        
        icon_lbl = QLabel(icon)
        icon_lbl.setStyleSheet(f"font-size: 20px; color: {color};")
        layout.addWidget(icon_lbl)
        
        info = QVBoxLayout()
        
        t = QLabel(title)
        t.setStyleSheet("font-size: 15px; font-weight: 600; color: white;")
        info.addWidget(t)
        
        s = QLabel(subtitle)
        s.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.6);")
        info.addWidget(s)
        
        layout.addLayout(info, 1)
        
        a = QLabel(amount)
        a.setStyleSheet(f"font-size: 14px; font-weight: 600; color: {color};")
        layout.addWidget(a)
        
        return widget
    
    def sos_clicked(self):
        self.parent().parent().setCurrentIndex(2)  # Aller à SOS
    
    def diagnostic_clicked(self):
        self.parent().parent().setCurrentIndex(1)  # Aller à Chat
    
    def mechanic_clicked(self):
        QMessageBox.information(self, "Mécaniciens", "3 mécaniciens trouvés près de vous !\n\n1. Pierre Konan - 500m\n2. Garage Auto Pro - 1.2km\n3. Méca Express - 1.5km")
    
    def marketplace_clicked(self):
        QMessageBox.information(self, "Marketplace", "Marketplace - Bientôt disponible !")

class ChatWidget(QWidget):
    """Page de chat avec l'IA"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
    
    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(16)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # Header
        header = QHBoxLayout()
        
        back_btn = IconButton("←")
        back_btn.clicked.connect(self.go_back)
        header.addWidget(back_btn)
        
        title = QLabel("🤖 MecaAI")
        title.setStyleSheet("font-size: 20px; font-weight: 700; color: #FF8C42;")
        header.addWidget(title)
        
        header.addStretch()
        
        status = QLabel("● En ligne")
        status.setStyleSheet("font-size: 13px; color: #10b981;")
        header.addWidget(status)
        
        layout.addLayout(header)
        
        # Zone de chat
        self.chat_area = QScrollArea()
        self.chat_area.setWidgetResizable(True)
        self.chat_area.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.chat_area.setStyleSheet("border: none; background: transparent;")
        
        self.chat_widget = QWidget()
        self.chat_layout = QVBoxLayout(self.chat_widget)
        self.chat_layout.setSpacing(12)
        self.chat_layout.setAlignment(Qt.AlignTop)
        self.chat_layout.addStretch()
        
        self.chat_area.setWidget(self.chat_widget)
        layout.addWidget(self.chat_area)
        
        # Message de bienvenue
        self.add_ai_message("Bonjour ! Je suis MecaAI, votre assistant automobile intelligent.\n\nJe peux vous aider avec :\n🔧 Diagnostic de pannes\n💰 Estimation des coûts\n📍 Localisation de garages\n🚗 Conseils d'entretien\n\nComment puis-je vous aider aujourd'hui ?")
        
        # Suggestions
        suggestions = QHBoxLayout()
        suggestions.setSpacing(8)
        
        suggestions_list = [
            "Problème moteur",
            "Prix vidange",
            "Fumée moteur"
        ]
        
        for text in suggestions_list:
            btn = QPushButton(text)
            btn.setStyleSheet("""
                QPushButton {
                    background-color: rgba(255,140,66,0.2);
                    color: #FF8C42;
                    border: 1px solid rgba(255,140,66,0.3);
                    border-radius: 16px;
                    padding: 8px 16px;
                    font-size: 12px;
                }
                QPushButton:hover {
                    background-color: rgba(255,140,66,0.3);
                }
            """)
            btn.setCursor(Qt.PointingHandCursor)
            btn.clicked.connect(lambda checked, t=text: self.send_suggestion(t))
            suggestions.addWidget(btn)
        
        suggestions.addStretch()
        layout.addLayout(suggestions)
        
        # Input area
        input_layout = QHBoxLayout()
        input_layout.setSpacing(12)
        
        self.message_input = QLineEdit()
        self.message_input.setPlaceholderText("Écrivez votre message...")
        self.message_input.setStyleSheet("""
            QLineEdit {
                background-color: #1a1a3e;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 14px 18px;
                font-size: 14px;
                color: white;
            }
            QLineEdit:focus {
                border-color: #FF8C42;
            }
        """)
        self.message_input.returnPressed.connect(self.send_message)
        input_layout.addWidget(self.message_input)
        
        send_btn = QPushButton("➤")
        send_btn.setObjectName("primary_btn")
        send_btn.setFixedSize(48, 48)
        send_btn.setCursor(Qt.PointingHandCursor)
        send_btn.clicked.connect(self.send_message)
        input_layout.addWidget(send_btn)
        
        layout.addLayout(input_layout)
    
    def add_user_message(self, message):
        bubble = self.create_bubble(message, True)
        self.chat_layout.insertWidget(self.chat_layout.count() - 1, bubble)
        self.scroll_to_bottom()
    
    def add_ai_message(self, message):
        bubble = self.create_bubble(message, False)
        self.chat_layout.insertWidget(self.chat_layout.count() - 1, bubble)
        self.scroll_to_bottom()
    
    def create_bubble(self, message, is_user):
        container = QWidget()
        layout = QHBoxLayout(container)
        layout.setContentsMargins(0, 0, 0, 0)
        
        if not is_user:
            # Avatar IA
            avatar = QLabel("🤖")
            avatar.setStyleSheet("font-size: 28px; padding: 4px;")
            layout.addWidget(avatar)
        
        bubble = QLabel(message)
        bubble.setWordWrap(True)
        bubble.setTextInteractionFlags(Qt.TextSelectableByMouse)
        
        if is_user:
            bubble.setStyleSheet(f"""
                QLabel {{
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                        stop:0 {COLORS['primary']}, stop:1 {COLORS['primary_light']});
                    color: white;
                    border-radius: 16px;
                    padding: 12px 16px;
                    font-size: 14px;
                }}
            """)
            layout.addStretch()
            layout.addWidget(bubble)
        else:
            bubble.setStyleSheet("""
                QLabel {
                    background-color: rgba(255,255,255,0.1);
                    color: white;
                    border-radius: 16px;
                    padding: 12px 16px;
                    font-size: 14px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
            """)
            layout.addWidget(bubble)
            layout.addStretch()
        
        return container
    
    def scroll_to_bottom(self):
        QTimer.singleShot(100, lambda: self.chat_area.verticalScrollBar().setValue(
            self.chat_area.verticalScrollBar().maximum()
        ))
    
    def send_message(self):
        message = self.message_input.text().strip()
        if not message:
            return
        
        self.add_user_message(message)
        self.message_input.clear()
        
        # Simuler délai IA
        QTimer.singleShot(600, lambda: self.get_ai_response(message))
    
    def send_suggestion(self, text):
        self.message_input.setText(text)
        self.send_message()
    
    def get_ai_response(self, message):
        response = ai.chat(message)
        self.add_ai_message(response)
    
    def go_back(self):
        self.parent().parent().setCurrentIndex(0)

class SOSWidget(QWidget):
    """Page SOS Urgence"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
    
    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setSpacing(20)
        layout.setContentsMargins(30, 30, 30, 30)
        
        # Header
        header = QHBoxLayout()
        
        back_btn = IconButton("←")
        back_btn.clicked.connect(self.go_back)
        header.addWidget(back_btn)
        
        title = QLabel("⚡ SOS Urgence")
        title.setStyleSheet(f"font-size: 22px; font-weight: 700; color: {COLORS['danger']};")
        header.addWidget(title)
        
        header.addStretch()
        layout.addLayout(header)
        
        # Icône
        icon = QLabel("⚡")
        icon.setStyleSheet(f"font-size: 80px; color: {COLORS['danger']}; margin: 20px;")
        icon.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon)
        
        # Description
        desc = QLabel("Décrivez votre problème et nous trouverons un mécanicien rapidement")
        desc.setStyleSheet("font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 20px;")
        desc.setWordWrap(True)
        desc.setAlignment(Qt.AlignCenter)
        layout.addWidget(desc)
        
        # Formulaire
        form = ModernCard()
        form_layout = QVBoxLayout(form)
        form_layout.setSpacing(16)
        
        # Problème
        problem_label = QLabel("Quel est le problème ?")
        problem_label.setStyleSheet("font-size: 14px; color: rgba(255,255,255,0.8);")
        form_layout.addWidget(problem_label)
        
        self.problem_input = QTextEdit()
        self.problem_input.setPlaceholderText("Ex: Mon moteur fait un bruit bizarre et fume beaucoup...")
        self.problem_input.setMaximumHeight(100)
        form_layout.addWidget(self.problem_input)
        
        # Marque et modèle
        row = QHBoxLayout()
        
        self.brand = QLineEdit()
        self.brand.setPlaceholderText("Marque (ex: Toyota)")
        row.addWidget(self.brand)
        
        self.model = QLineEdit()
        self.model.setPlaceholderText("Modèle (ex: Corolla)")
        row.addWidget(self.model)
        
        form_layout.addLayout(row)
        
        layout.addWidget(form)
        
        # Spacer
        layout.addStretch()
        
        # Bouton SOS
        sos_btn = QPushButton("⚡  DEMANDER DE L'AIDE MAINTENANT")
        sos_btn.setObjectName("sos_btn")
        sos_btn.setCursor(Qt.PointingHandCursor)
        sos_btn.clicked.connect(self.send_sos)
        layout.addWidget(sos_btn)
        
        # Info
        info = QLabel("🚨 Les mécaniciens disponibles 24/7 seront alertés immédiatement")
        info.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 10px;")
        info.setAlignment(Qt.AlignCenter)
        layout.addWidget(info)
    
    def send_sos(self):
        if not self.problem_input.toPlainText().strip():
            QMessageBox.warning(self, "Attention", "Veuillez décrire votre problème")
            return
        
        # Simuler envoi
        QMessageBox.information(self, "SOS Envoyé", 
            "🆘 Alerte envoyée !\n\n"
            "2 mécaniciens disponibles ont été notifiés :\n"
            "• Pierre Konan (500m) - ETA 8 min\n"
            "• Garage Auto Pro (1.2km) - ETA 12 min\n\n"
            "Ils vont vous contacter rapidement.")
        
        self.go_back()
    
    def go_back(self):
        self.parent().parent().setCurrentIndex(0)

# ═════════════════════════════════════════════════════════════════════════════
# 🖥️ FENÊTRE PRINCIPALE
# ═════════════════════════════════════════════════════════════════════════════

class MecaMasterWindow(QMainWindow):
    """Fenêtre principale"""
    
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Meca Master - Application Automobile")
        self.setMinimumSize(1200, 800)
        
        # Style global
        self.setStyleSheet(STYLESHEET)
        
        # Widget central
        central = QWidget()
        self.setCentralWidget(central)
        
        layout = QHBoxLayout(central)
        layout.setSpacing(0)
        layout.setContentsMargins(0, 0, 0, 0)
        
        # Sidebar
        sidebar = self.create_sidebar()
        layout.addWidget(sidebar)
        
        # Zone de contenu
        self.stack = QStackedWidget()
        
        # Pages
        self.home_widget = HomeWidget()
        self.chat_widget = ChatWidget()
        self.sos_widget = SOSWidget()
        
        self.stack.addWidget(self.home_widget)
        self.stack.addWidget(self.chat_widget)
        self.stack.addWidget(self.sos_widget)
        
        layout.addWidget(self.stack, 1)
        
        # Tray icon
        self.create_tray_icon()
    
    def create_sidebar(self):
        sidebar = QFrame()
        sidebar.setObjectName("sidebar")
        sidebar.setFixedWidth(280)
        
        layout = QVBoxLayout(sidebar)
        layout.setSpacing(8)
        layout.setContentsMargins(16, 20, 16, 20)
        
        # Logo
        logo = QHBoxLayout()
        
        icon = QLabel("🔧")
        icon.setStyleSheet(f"font-size: 32px; background-color: {COLORS['primary']}; padding: 8px; border-radius: 12px;")
        logo.addWidget(icon)
        
        text = QVBoxLayout()
        title = QLabel("Meca Master")
        title.setStyleSheet("font-size: 20px; font-weight: 700; color: #FF8C42;")
        text.addWidget(title)
        
        subtitle = QLabel("Application")
        subtitle.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.5);")
        text.addWidget(subtitle)
        
        logo.addLayout(text)
        layout.addLayout(logo)
        
        # Separator
        sep = QFrame()
        sep.setFrameShape(QFrame.HLine)
        sep.setStyleSheet("background-color: rgba(255,255,255,0.1); margin: 10px 0;")
        sep.setFixedHeight(1)
        layout.addWidget(sep)
        
        # Menu
        menu_label = QLabel("MENU PRINCIPAL")
        menu_label.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4); margin: 10px 0;")
        layout.addWidget(menu_label)
        
        self.sidebar_buttons = []
        
        menu_items = [
            ("🏠", "Accueil", 0),
            ("📊", "Dashboard", 0),
            ("🚗", "Mes Véhicules", 0),
            ("📍", "Carte", 0),
            ("🏪", "Marketplace", 0),
        ]
        
        for icon, text, page in menu_items:
            btn = SidebarButton(icon, text)
            btn.clicked.connect(lambda checked, p=page: self.change_page(p))
            layout.addWidget(btn)
            self.sidebar_buttons.append(btn)
        
        # Services
        services_label = QLabel("SERVICES")
        services_label.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4); margin: 20px 0 10px 0;")
        layout.addWidget(services_label)
        
        services = [
            ("⚡", "SOS Urgence", 2),
            ("📜", "Historique", 0),
            ("💬", "Messages 3", 1),
            ("🔔", "Notifications 5", 0),
        ]
        
        for icon, text, page in services:
            btn = SidebarButton(icon, text)
            if page >= 0:
                btn.clicked.connect(lambda checked, p=page: self.change_page(p))
            layout.addWidget(btn)
            self.sidebar_buttons.append(btn)
        
        layout.addStretch()
        
        # User profile
        profile = ModernCard()
        profile_layout = QHBoxLayout(profile)
        profile_layout.setSpacing(12)
        
        user_icon = QLabel("👤")
        user_icon.setStyleSheet("font-size: 32px;")
        profile_layout.addWidget(user_icon)
        
        user_info = QVBoxLayout()
        name = QLabel("Jean Dupont")
        name.setStyleSheet("font-size: 14px; font-weight: 600; color: white;")
        user_info.addWidget(name)
        
        status = QLabel("● En ligne")
        status.setStyleSheet("font-size: 11px; color: #10b981;")
        user_info.addWidget(status)
        
        profile_layout.addLayout(user_info)
        layout.addWidget(profile)
        
        # Activer le premier bouton
        self.sidebar_buttons[0].setChecked(True)
        
        return sidebar
    
    def create_tray_icon(self):
        self.tray_icon = QSystemTrayIcon(self)
        self.tray_icon.setIcon(self.style().standardIcon(QStyle.SP_ComputerIcon))
        
        tray_menu = QMenu()
        show_action = QAction("Afficher", self)
        show_action.triggered.connect(self.show)
        
        quit_action = QAction("Quitter", self)
        quit_action.triggered.connect(self.close)
        
        tray_menu.addAction(show_action)
        tray_menu.addSeparator()
        tray_menu.addAction(quit_action)
        
        self.tray_icon.setContextMenu(tray_menu)
        self.tray_icon.show()
    
    def change_page(self, index):
        self.stack.setCurrentIndex(index)
        
        # Mettre à jour les boutons
        for btn in self.sidebar_buttons:
            btn.setChecked(False)
        
        # Cocher le bouton correspondant (approximatif)
        if index < len(self.sidebar_buttons):
            self.sidebar_buttons[index].setChecked(True)
    
    def closeEvent(self, event):
        self.tray_icon.hide()
        event.accept()

# ═════════════════════════════════════════════════════════════════════════════
# 🚀 POINT D'ENTRÉE
# ═════════════════════════════════════════════════════════════════════════════

def main():
    app = QApplication(sys.argv)
    
    # Configuration de l'application
    app.setApplicationName("Meca Master")
    app.setApplicationVersion("1.0.0")
    app.setOrganizationName("MecaMaster")
    
    # Style fusion pour meilleur rendu
    app.setStyle("Fusion")
    
    # Palette sombre
    palette = QPalette()
    palette.setColor(QPalette.Window, QColor("#0f0f23"))
    palette.setColor(QPalette.WindowText, Qt.white)
    palette.setColor(QPalette.Base, QColor("#1a1a3e"))
    palette.setColor(QPalette.AlternateBase, QColor("#16213e"))
    palette.setColor(QPalette.Text, Qt.white)
    palette.setColor(QPalette.Button, QColor("#1a1a3e"))
    palette.setColor(QPalette.ButtonText, Qt.white)
    palette.setColor(QPalette.BrightText, Qt.red)
    palette.setColor(QPalette.Highlight, QColor("#FF8C42"))
    palette.setColor(QPalette.HighlightedText, Qt.white)
    app.setPalette(palette)
    
    # Créer et afficher la fenêtre
    window = MecaMasterWindow()
    window.show()
    
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
